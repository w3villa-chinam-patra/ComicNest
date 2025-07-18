import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  HttpStatus,
  HttpCode,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { authErrorMessages, authSuccessMessages } from './constants';
import { ValidateUrlParamPipe } from 'src/common/pipes';
import { AppError } from 'src/common/errors';
import { appConstants } from 'src/common/constants';
import { Request, Response } from 'express';
import { JwtCookieAuthGuard } from 'src/common/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryMulterStorage } from 'src/common/utils';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    await this.authService.register(createAuthDto);
    return { message: authSuccessMessages.EMAIL_REGISTER_SUCCESS };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() createAuthDto: CreateAuthDto,
    @Res({ passthrough: appConstants.TRUTHY_FALSY_VALUES.TRUE }) res: Response,
  ) {
    await this.authService.login(createAuthDto, res);
    return { message: authSuccessMessages.LOGIN };
  }

  @Get('email-verify/:token')
  async emailVerify(
    @Param('token', new ValidateUrlParamPipe('token')) token: string,
  ) {
    try {
      await this.authService.emailVerify(token);
      return { message: authSuccessMessages.EMAIL_VERIFICATION_SUCCESS };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(authErrorMessages.EMAIL_VERIFICATION_FAILED);
    }
  }

  @UseGuards(JwtCookieAuthGuard)
  @Post('send-otp-sms')
  async sendOtpSms(
    @Body() mobilePayload: { mobileNumber: string },
    @Req() req: Request,
  ) {
    try {
      await this.authService.sendOtpSms(
        mobilePayload.mobileNumber,
        req['user'] as User,
      );
      return { message: authSuccessMessages.OTP_SENT_SUCCESS };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(authErrorMessages.FAILED_TO_SEND_OTP);
    }
  }

  @UseGuards(JwtCookieAuthGuard)
  @Post('verify-otp')
  async verifyOtp(@Body() otpPayload: { otp: string }, @Req() req: Request) {
    try {
      await this.authService.verifyOtp(otpPayload.otp, req['user'] as User);
      return { message: authSuccessMessages.OTP_VERIFY_SUCCESS };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(authErrorMessages.FAILED_TO_VERIFY_OTP);
    }
  }

  @UseGuards(JwtCookieAuthGuard)
  @Post('is-otp-already-sent')
  async isOtpAlreadySent(
    @Body() mobilePayload: { mobileNumber: string },
    @Req() req: Request,
  ) {
    try {
      return await this.authService.isOtpAlreadySent(
        mobilePayload.mobileNumber,
        req['user'] as User,
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(authErrorMessages.FAILED_TO_VERIFY_OTP);
    }
  }

  @UseGuards(JwtCookieAuthGuard)
  @Post('upload-profile-photo')
  @UseInterceptors(
    FileInterceptor('file', { storage: CloudinaryMulterStorage }),
  )
  async uploadProfilePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    try {
      await this.authService.uploadProfilePhoto(file.path, req['user'] as User);
      return { message: authSuccessMessages.PROFILE_PHOTO_UPDATE_SUCCESS };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(authErrorMessages.FAILED_TO_UPLOAD_PROFILE_PHOTO);
    }
  }

  @UseGuards(JwtCookieAuthGuard)
  @Post('upload-profile-photo-skip')
  async uploadProfilePhotoSkip(@Req() req: Request) {
    try {
      this.authService.uploadProfilePhotoSkip(req['user'] as User);
      return { message: authSuccessMessages.PROFILE_PHOTO_UPDATE_SUCCESS };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(authErrorMessages.FAILED_TO_SKIP_UPDATE_PROFILE_PHOTO);
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: authSuccessMessages.LOGOUT_SUCCESS };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // This guard redirects the user to Google's consent screen
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    try {
      // This is the callback URL. Passport handles the logic and attaches the user
      // to req.user based on the 'validate' method in your strategy.

      // Here, you would get the user from req.user
      const userFromGoogle = req.user;

      await this.authService.googleSingIn(userFromGoogle, res);

      // Redirect the user back to your frontend application
      const clientUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
      return res.redirect(`${clientUrl}/dashboard`);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(authErrorMessages.FAILED_TO_LOGIN);
    }
  }
}
