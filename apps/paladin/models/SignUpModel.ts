import { validator } from '@razvan11/paladin';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

@validator()
export class SignUpModel {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsUrl()
  image: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsString()
  profession: string;
}
