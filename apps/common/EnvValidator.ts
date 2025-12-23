import { env, validator } from '@razvan11/paladin';
import { IsString } from 'class-validator';
@validator()
export class EnvValidator {
  @IsString()
  @env()
  private readonly APP_URL: string;
}
