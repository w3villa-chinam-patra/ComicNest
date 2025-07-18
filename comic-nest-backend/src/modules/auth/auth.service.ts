import { Injectable, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateAuthDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto, UpdateUserDto } from '../user/dto';
import { PasswordUtil, RegexUtil, TimeUtil } from 'src/common/utils';
import { ConfigService } from '@nestjs/config';
import { appConstants, errorMessages } from 'src/common/constants';
import { AppError } from 'src/common/errors';
import { authErrorMessages, authSuccessMessages } from './constants';
import { JWTService, MailService, TwilioService } from 'src/common/services';
import { DatabaseService } from 'src/database/database.service';
import { NextAction } from 'src/common/enums';
import { Response } from 'express';
import { RandomNumberUtil } from 'src/common/utils/random-number.util';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly jwtService: JWTService,
    private readonly databaseService: DatabaseService,
    private readonly twilioService: TwilioService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const isEmailAlreadyExists = await this.userService.findOneByEmail(
      createAuthDto.email,
    );
    if (isEmailAlreadyExists) {
      throw new AppError(authErrorMessages.EMAIL_ALREADY_REGISTERED);
    }
    const envSalt = this.configService.get<string>('BCRYPT_SALT_ROUNDS');
    const saltRounds = parseInt(
      envSalt || '',
      appConstants.BCRYPT_SALT_ROUNDS_DEFAULT,
    );
    const hashedPassword = await PasswordUtil.hashPassword(
      createAuthDto.password,
      isNaN(saltRounds) ? undefined : saltRounds,
    );
    createAuthDto.password = hashedPassword;

    let registeredUser;
    let verificationToken;
    await this.databaseService.$transaction(async (tx) => {
      registeredUser = await tx.user.create({
        data: createAuthDto,
      });

      verificationToken = (
        await this.jwtService.createEmailVerificationToken({
          id: registeredUser.id,
        })
      ).token;

      await tx.emailVerification.create({
        data: { userId: registeredUser.id, verificationToken },
      });
    });

    await this.mailService.sendEmailVerification(
      registeredUser.email,
      verificationToken,
    );
  }

  async login(
    createAuthDto: CreateAuthDto,
    @Res({ passthrough: appConstants.TRUTHY_FALSY_VALUES.TRUE }) res: Response,
    isOAuthLogin: boolean = appConstants.TRUTHY_FALSY_VALUES.FALSE,
  ) {
    const requiredUser = await this.databaseService.user.findUnique({
      where: { email: createAuthDto.email },
    });
    if (!requiredUser) {
      throw new AppError(authErrorMessages.EMAIL_NOT_FOUND_PLEASE_REGISTER);
    }

    if (!isOAuthLogin) {
      if (!requiredUser.password) {
        throw new AppError(authErrorMessages.INVALID_PASSWORD);
      }
      const isPasswordMatch = await PasswordUtil.comparePasswords(
        createAuthDto.password,
        requiredUser.password,
      );
      if (!isPasswordMatch) {
        throw new AppError(authErrorMessages.INVALID_PASSWORD);
      }
    }

    const accessToken = await this.jwtService.createAccessToken({
      id: requiredUser.id,
    });
    res.cookie('access_token', accessToken.token, {
      httpOnly: appConstants.TRUTHY_FALSY_VALUES.TRUE, // Cannot be accessed via JS
      secure:
        this.configService.get<string>('NODE_ENV') ===
        appConstants.PRODUCTION_ENV, // use HTTPS in prod
      sameSite: 'lax', // or 'strict'/'none' depending on your use case
      maxAge: appConstants.DAY_IN_MS, // 1 day
    });
  }

  async emailVerify(token: string) {
    const emailVerificationDetails =
      await this.databaseService.emailVerification.findUnique({
        where: {
          verificationToken: token,
        },
      });
    if (!emailVerificationDetails) {
      throw new AppError(authErrorMessages.EMAIL_VERIFICATION_LINK_INVALID);
    }

    const requiredUser = await this.userService.findByIdOrThrow(
      emailVerificationDetails.userId,
      authErrorMessages.EMAIL_VERIFICATION_USER_NOT_FOUND,
    );

    if (requiredUser.emailVerified) {
      throw new AppError(authErrorMessages.EMAIL_ALREADY_VERIFIED);
    }

    const tokenVerifyDetails = await this.jwtService.verifyToken(token);
    if (!tokenVerifyDetails.valid) {
      throw new AppError(authErrorMessages.EMAIL_VERIFICATION_LINK_INVALID);
    } else if (tokenVerifyDetails.expired) {
      if (requiredUser.nextAction === NextAction.EMAIL_VERIFICATION) {
        const verificationToken = (
          await this.jwtService.createEmailVerificationToken({
            id: requiredUser.id,
          })
        ).token;
        await this.mailService.sendEmailVerification(
          requiredUser.email,
          verificationToken,
        );
        throw new AppError(
          authErrorMessages.EMAIL_VERIFICATION_EXPIRED_NEW_LINK_SENT,
        );
      } else {
        throw new AppError(authErrorMessages.EMAIL_VERIFICATION_LINK_EXPIRED);
      }
    }

    const transformedEmailVerifiedUser = plainToInstance(
      UpdateUserDto,
      requiredUser,
    );

    await this.userService.update(tokenVerifyDetails.payload.id, {
      ...transformedEmailVerifiedUser,
      emailVerified: appConstants.TRUTHY_FALSY_VALUES.TRUE,
      emailVerifiedAt: TimeUtil.getCurrentISOString(),
      nextAction: NextAction.MOBILE_VERIFICATION,
    });
  }

  async sendOtpSms(mobileNumber: string, user: User) {
    // verify the mobile number
    const isValidPhoneNumber = RegexUtil.isValidMobileNumber(mobileNumber);
    if (!isValidPhoneNumber) {
      throw new AppError(authErrorMessages.INVALID_MOBILE_NUMBER);
    }
    // generate OTP
    const otp = RandomNumberUtil.generateRandomNumber(
      appConstants.OTP_DIGIT_SIZE,
    );
    // generate the OTP expiry time
    const expiresAt = TimeUtil.addMinutesToISOString(
      appConstants.OTP_EXPIRY_IN_MINS,
    );
    // update the user's mobile number
    if (!user.mobileNumber) {
      const isMobileNumberExists = await this.databaseService.user.findUnique({
        where: {
          mobileNumber,
        },
      });
      if (isMobileNumberExists) {
        throw new AppError(authErrorMessages.PHONE_NUMBER_IN_USE);
      }
      await this.userService.update(user.id, { mobileNumber });
    }

    // add the otp in the OTPVerification table.
    const otpSendAlready =
      await this.databaseService.oTPVerification.findUnique({
        where: { userId: user.id },
      });

    if (otpSendAlready) {
      console.log(
        TimeUtil.getAbsoluteDifferenceInMinutes(
          otpSendAlready.updatedAt.toISOString(),
          TimeUtil.getCurrentISOString(),
        ),
      );
      if (
        TimeUtil.getAbsoluteDifferenceInMinutes(
          otpSendAlready.updatedAt.toISOString(),
          TimeUtil.getCurrentISOString(),
        ) < appConstants.RESENT_OTP_DURATION_IN_MINS
      ) {
        throw new AppError(authErrorMessages.OTP_ALREADY_SENT);
      } else {
        const minutesSinceLastOtpSent = TimeUtil.getAbsoluteDifferenceInMinutes(
          otpSendAlready.updatedAt.toISOString(),
          TimeUtil.getCurrentISOString(),
        );

        if (
          otpSendAlready.retryCount >= appConstants.OTP_RETRY_COUNT &&
          minutesSinceLastOtpSent <
            appConstants.OTP_RETRY_COOL_DOWN_DURATION_MINUTES
        ) {
          throw new AppError(authErrorMessages.OTP_RETRY_LIMIT_EXCEEDED);
        }
        if (
          minutesSinceLastOtpSent <
          appConstants.OTP_RETRY_COOL_DOWN_DURATION_MINUTES
        ) {
          await this.databaseService.oTPVerification.update({
            where: { id: otpSendAlready.id },
            data: {
              otp,
              retryCount: otpSendAlready.retryCount + 1,
              expiresAt,
            },
          });
        } else {
          await this.databaseService.oTPVerification.update({
            where: { id: otpSendAlready.id },
            data: {
              otp,
              retryCount: appConstants.TRUTHY_FALSY_VALUES.ZERO,
              expiresAt,
            },
          });
        }
      }
    } else {
      await this.databaseService.oTPVerification.create({
        data: { userId: user.id, otp, expiresAt },
      });
    }

    // send OTP using twilio messaging service
    // await this.twilioService.sendSms(mobileNumber, otp);
    console.log(otp);
  }

  async verifyOtp(otp: string, user: User) {
    const sendOtpDetails =
      await this.databaseService.oTPVerification.findUnique({
        where: { userId: user.id },
      });
    if (!sendOtpDetails) {
      throw new Error();
    }
    if (TimeUtil.isTimeExpired(sendOtpDetails?.expiresAt.toISOString())) {
      throw new AppError(authErrorMessages.OTP_EXPIRED);
    }
    if (sendOtpDetails.otp !== otp) {
      throw new AppError(authErrorMessages.INVALID_OTP);
    }
    await this.databaseService.oTPVerification.update({
      where: { id: sendOtpDetails.id },
      data: {
        ...sendOtpDetails,
        verified: appConstants.TRUTHY_FALSY_VALUES.TRUE,
      },
    });
    await this.userService.update(user.id, {
      mobileVerified: appConstants.TRUTHY_FALSY_VALUES.TRUE,
      mobileVerifiedAt: TimeUtil.getCurrentISOString(),
      nextAction: NextAction.PROFILE_COMPLETION,
    });
  }

  async isOtpAlreadySent(mobileNumber: string, user: User) {
    const sendOtpDetails =
      await this.databaseService.oTPVerification.findUnique({
        where: { userId: user.id },
      });
    if (sendOtpDetails && sendOtpDetails.verified) {
      throw new AppError(authErrorMessages.MOBILE_ALREADY_VERIFIED);
    }
    if (
      sendOtpDetails &&
      TimeUtil.isTimeExpired(sendOtpDetails.expiresAt.toISOString())
    ) {
      await this.sendOtpSms(mobileNumber, user);
      return { message: authSuccessMessages.OTP_RESENT_DUE_TO_EXPIRY };
    }
    if (
      sendOtpDetails &&
      !TimeUtil.isTimeExpired(sendOtpDetails.expiresAt.toISOString())
    ) {
      return { message: authSuccessMessages.OTP_AVAILABLE_FOR_VERIFICATION };
    }
    throw new AppError(authErrorMessages.OTP_NOT_SENT);
  }

  async uploadProfilePhoto(filePath: string, user: User) {
    await this.userService.update(user.id, {
      profilePhoto: filePath,
      nextAction: NextAction.NONE,
    });
  }

  async uploadProfilePhotoSkip(user: User) {
    await this.userService.update(user.id, {
      nextAction: NextAction.NONE,
    });
  }

  async googleSingIn(user: CreateUserDto, res: Response) {
    const isUserExists = await this.userService.findOneByEmail(user.email);
    if (!isUserExists) {
      await this.userService.create(user);
    }
    await this.login(
      { email: user.email, password: user.password! },
      res,
      appConstants.TRUTHY_FALSY_VALUES.TRUE,
    );
  }
}
