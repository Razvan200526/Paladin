import { IsOTP } from '@common/validators/isOTPValid';
import { validator } from '@razvan11/paladin';
import { IsEmail, IsStrongPassword } from 'class-validator';

@validator()
export class ResetPasswordModel {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOTP()
  otp: string;
}
