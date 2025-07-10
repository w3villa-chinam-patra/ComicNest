import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [AuthController],
  providers: [DatabaseService, AuthService, UserService],
})
export class AuthModule {}
