import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Exclude } from 'class-transformer';

export class ResponseUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @Exclude()
  password: string;
}
