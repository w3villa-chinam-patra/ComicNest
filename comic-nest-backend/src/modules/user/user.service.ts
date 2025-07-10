import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { plainToInstance } from 'class-transformer';
import { appConstants } from 'src/common/constants';
import { CreateUserDto, ResponseUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.databaseService.user.create({
      data: createUserDto,
    });
    return plainToInstance(ResponseUserDto, createdUser, {
      excludeExtraneousValues: appConstants.TRUTHY_FALSY_VALUES.TRUE,
    });
  }

  async findAll() {
    const allUsers = await this.databaseService.user.findMany();
    return plainToInstance(ResponseUserDto, allUsers, {
      excludeExtraneousValues: appConstants.TRUTHY_FALSY_VALUES.TRUE,
    });
  }

  async findOne(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: appConstants.TRUTHY_FALSY_VALUES.TRUE,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    });
    return plainToInstance(ResponseUserDto, updatedUser, {
      excludeExtraneousValues: appConstants.TRUTHY_FALSY_VALUES.TRUE,
    });
  }

  async remove(id: string) {
    const deletedUser = await this.databaseService.user.delete({
      where: { id },
    });
    return plainToInstance(ResponseUserDto, deletedUser, {
      excludeExtraneousValues: appConstants.TRUTHY_FALSY_VALUES.TRUE,
    });
  }
}
