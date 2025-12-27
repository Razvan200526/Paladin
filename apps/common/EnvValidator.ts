import { env, validator } from '@razvan11/paladin';
import { IsString } from 'class-validator';

@validator()
export class EnvValidator {
  @IsString()
  @env()
  private readonly APP_DATABASE_URL: string;

  @IsString()
  @env()
  private readonly APP_URL: string;

  @IsString()
  @env()
  private readonly R2_ACCESS_KEY: string;

  @IsString()
  @env()
  private readonly R2_SECRET_ACCESS_KEY: string;

  @IsString()
  @env()
  private readonly R2_ENDPOINT: string;

  @IsString()
  @env()
  private readonly R2_BUCKET_NAME: string;
}
