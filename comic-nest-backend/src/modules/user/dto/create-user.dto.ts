// src/user/dto/create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
  IsDateString,
  Length,
} from 'class-validator';
import { Role, NextAction } from '@prisma/client';
import { Expose } from 'class-transformer';

export class CreateUserDto {
  @Expose()
  @IsOptional()
  id: string
  
  @Expose()
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;

  @Expose()
  @IsOptional()
  @IsString()
  username?: string;

  @Expose()
  @IsOptional()
  @IsString()
  firstName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  lastName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  address?: string;

  @Expose()
  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @Length(6, 100, { message: 'Password must be at least 6 characters.' })
  password: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @Expose()
  @IsOptional()
  @IsDateString()
  emailVerifiedAt?: string;

  @Expose()
  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  mobileVerified?: boolean;

  @Expose()
  @IsOptional()
  @IsDateString()
  mobileVerifiedAt?: string;

  @Expose()
  @IsOptional()
  @IsEnum(Role, { message: 'Invalid role.' })
  role?: Role;

  @Expose()
  @IsOptional()
  @IsEnum(NextAction, { message: 'Invalid next action.' })
  nextAction?: NextAction;
}
