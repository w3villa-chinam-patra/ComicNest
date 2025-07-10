import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateAuthDto {
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @Length(6, 100, { message: 'Password must be at least 6 characters.' })
  password: string;
}
