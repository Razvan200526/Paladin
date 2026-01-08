import { validator } from '@razvan11/paladin';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@validator()
export class UpdateUserModel {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
