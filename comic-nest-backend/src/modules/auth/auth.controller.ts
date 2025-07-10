import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { authSuccessMessages } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    const registeredUser = await this.authService.register(createAuthDto);
    return { message: authSuccessMessages.REGISTER, data: registeredUser };
  }
}
