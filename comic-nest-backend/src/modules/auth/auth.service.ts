import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { DatabaseService } from 'src/database/database.service';
import { CreateAuthDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '../user/dto';
import { PasswordUtil } from 'src/common/utils';
import { ConfigService } from '@nestjs/config';
import { appConstants } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
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

    const createUserDtoTransformed = plainToInstance(
      CreateUserDto,
      createAuthDto,
    );

    await this.userService.create(createUserDtoTransformed);

    
  }
}
