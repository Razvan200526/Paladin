import * as z from 'zod';
import { printEnvErrors } from './migration/pretty-error';

const CommonEnv = z.object({
  BETTER_AUTH_SECRET: z.string(),
  PORT: z.string(),
  APP_URL: z.string(),
  APP_DATABASE_URL: z.string(),
  CORS_ORIGINS: z.string(),
  R2_TOKEN: z.string(),
  R2_ACCESS_KEY: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_ENDPOINT: z.string(),
  R2_BUCKET_NAME: z.string(),
  R2_ACCOUNT_ID: z.string(),
  SMTP_PORT: z.string(),
  ACCESS_TOKEN: z.string(),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_NAME: z.string(),
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']),
});

const DevelopmentEnv = CommonEnv.extend({
  NODE_ENV: z.literal('development'),
});

const ProductionEnv = CommonEnv.extend({
  NODE_ENV: z.literal('production'),
  RESEND_API_KEY: z.string(),
  MAIL_FROM: z.string(),
});

const TestEnv = CommonEnv.extend({
  NODE_ENV: z.literal('test'),
  RESEND_API_KEY: z.string().optional(),
  MAIL_FROM: z.string().optional(),
});

export const Env = z.discriminatedUnion('NODE_ENV', [
  DevelopmentEnv,
  ProductionEnv,
  TestEnv,
]);

export type Env = z.infer<typeof Env>;

const parseResult = Env.safeParse(Bun.env);
if (!parseResult.success) {
  printEnvErrors(parseResult.error.issues);
  process.exit(1);
}
export const env = parseResult.data;
