import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { userSuccessMessages } from './constants/user-success-messages.constant';
import { AppError } from 'src/common/errors';
import { userErrorMessages } from './constants/user-error-messages.constant';
import { CreateUserDto, UpdateUserDto } from './dto';

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const responseUserDto = await this.userService.findOne(id);
    if (!responseUserDto) {
      throw new AppError(userErrorMessages.NOT_FOUND);
    }
    return { message: userSuccessMessages.READ, data: responseUserDto };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new AppError(userErrorMessages.NOT_FOUND);
    }
    const responseUserDto = await this.userService.update(id, updateUserDto);
    return { message: userSuccessMessages.UPDATE, data: responseUserDto };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new AppError(userErrorMessages.NOT_FOUND);
    }

    const responseUserDto = await this.userService.remove(id);
    return { message: userSuccessMessages.DELETE, data: responseUserDto };
  }
}
