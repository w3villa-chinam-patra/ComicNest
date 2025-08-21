import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { DatabaseService } from 'src/database/database.service';
import { JWTService, MailService, TwilioService } from 'src/common/services';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports:[JwtModule],
  controllers: [AuthController],
  providers: [DatabaseService, AuthService, UserService, MailService, JWTService, TwilioService, GoogleStrategy],
})
export class AuthModule {}
