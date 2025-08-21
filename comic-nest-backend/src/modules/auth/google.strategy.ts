import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextAction, Role } from 'src/common/enums';
import { CreateUserDto } from '../user/dto';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    // In this function, you would find or create a user in your database.
    // For this example, we'll just pass the user data along.
    const userDto: CreateUserDto = {
      // Google provides the email.
      email: emails?.[0]?.value || '',

      // Google provides first and last names.
      firstName: name?.givenName,
      lastName: name?.familyName,

      // Google provides a profile photo URL.
      profilePhoto: photos?.[0]?.value,

      // For Google users, the email is considered verified by default.
      emailVerified: true,
      emailVerifiedAt: new Date().toISOString(),

      password: undefined,

      role: Role.USER,

      nextAction: NextAction.MOBILE_VERIFICATION,
    };

    // The 'done' callback passes the user object to be attached to req.user
    done(null, userDto);
  }
}
