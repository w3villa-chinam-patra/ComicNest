import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { userSuccessMessages } from './constants/user-success-messages.constant';
import { AppError } from 'src/common/errors';
import { userErrorMessages } from './constants/user-error-messages.constant';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Request } from 'express';
import { JwtCookieAuthGuard } from 'src/common/guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const responseUserDto = await this.userService.create(createUserDto);
    return { message: userSuccessMessages.CREATE, data: responseUserDto };
  }

  @Get()
  async findAll() {
    const responseUserDto = await this.userService.findAll();
    return { message: userSuccessMessages.READ_ALL, data: responseUserDto };
  }

  @UseGuards(JwtCookieAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return { message: userSuccessMessages.READ, data: req['user'] };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.userService.findByIdOrThrow(id, userErrorMessages.NOT_FOUND);
    const responseUserDto = await this.userService.findOne(id);
    return { message: userSuccessMessages.READ, data: responseUserDto };
  }

  @UseGuards(JwtCookieAuthGuard)
  @Patch()
  async updateUserProfile(@Req() req: Request, @Body() data) {
    try {
      await this.userService.updateUserProfile((req['user'] as User).id, data);
      return { message: userSuccessMessages.PROFILE_UPDATE_SUCCESS };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(userErrorMessages.PROFILE_UPDATE_FAILED);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.userService.findByIdOrThrow(id, userErrorMessages.NOT_FOUND);
    const responseUserDto = await this.userService.update(id, updateUserDto);
    return { message: userSuccessMessages.UPDATE, data: responseUserDto };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.userService.findByIdOrThrow(id, userErrorMessages.NOT_FOUND);
    const responseUserDto = await this.userService.remove(id);
    return { message: userSuccessMessages.DELETE, data: responseUserDto };
  }
}
