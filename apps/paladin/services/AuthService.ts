import { pe } from '@common/pretty-error';
import { random } from '@common/utils';
import { inject, logger, service } from '@razvan11/paladin';
import { betterAuth } from 'better-auth';
import { emailOTP, openAPI } from 'better-auth/plugins';
import { Pool } from 'pg';
import { ForgetPasswordEmailCheckMailer } from '../mailer/forgotPassword/ForgetPasswordEmailCheckMailer';
import { SignupEmailCheckMailer } from '../mailer/signupCheck/SignupEmailCheckMailer';

@service()
export class AuthService {
  constructor(@inject('APP_DATABASE_URL') private dbUrl: string) {}

  public getAuth() {
    return betterAuth({
      plugins: [
        openAPI(),
        emailOTP({
          otpLength: 6,
          expiresIn: 3600,
          allowedAttempts: 5,
          overrideDefaultEmailVerification: true,
          sendVerificationOTP: async function sendVerificationOTPHandler({
            email,
            otp,
            type,
          }: {
            email: string;
            otp: string;
            type?: string;
          }) {
            try {
              if (type === 'email-verification') {
                const mailer = new SignupEmailCheckMailer();
                await mailer.send({ to: email, otp, lang: 'en' });
              } else if (type === 'sign-in') {
                // optional: send sign-in OTP via email if you enable that flow
              } else {
                const mailer = new ForgetPasswordEmailCheckMailer();
                await mailer.send({ to: email, otp });
              }
            } catch (e) {
              console.error('Failed to send OTP email:', e);
              throw e;
            }
          } as any,
        }),
      ],
      logger: {
        disableColors: false,
        disabled: false,
        level: 'error',
        log: (level, message, ...args) => {
          console.error(pe.render(`[${level}] ${message}`, ...args));
        },
      },
      database: new Pool({
        connectionString: this.dbUrl,
      }),
      advanced: {
        database: {
          generateId: () => random.nanoid(15),
        },
        cookies: {
          session_token: {
            name: 'sessionTokenConfig',
            attributes: {}, //set cookie attributes
          },
        },
      },

      emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: true,
      },
      user: {
        modelName: 'users',
        fields: {
          name: 'name',
          email: 'email',
          password: 'password',
          emailVerified: 'is_email_verified',
          image: 'image',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
          rememberMeToken: 'remember_me_token',
        },
        additionalFields: {
          firstName: {
            fieldName: 'first_name',
            type: 'string',
            required: true,
          },
          lastName: { fieldName: 'last_name', type: 'string', required: true },
          bio: { fieldName: 'bio', type: 'string', required: false },
          profession: {
            fieldName: 'profession',
            type: 'string',
            required: false,
          },
        },
      },
      session: {
        modelName: 'user_sessions',
        fields: {
          userId: 'user_id',
          token: 'token',
          expiresAt: 'expires_at',
          ipAddress: 'ip_address',
          userAgent: 'user_agent',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      },
      account: {
        modelName: 'user_accounts',
        fields: {
          userId: 'user_id',
          providerId: 'provider_id',
          accountId: 'account_id',
          password: 'password',
          idToken: 'id_token',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      },
      verification: {
        modelName: 'user_verifications',
        fields: {
          identifier: 'identifier',
          value: 'value',
          expiresAt: 'expires_at',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      },
    });
  }

  public async signup(
    data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      image?: string;
      bio?: string;
      profession?: string;
    },
    headers?: Headers,
  ) {
    const auth = this.getAuth();
    return await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        //@ts-ignore
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        image: data.image,
        bio: data.bio || '',
        profession: data.profession || '',
      },
      headers,
    });
  }

  public async sendVerificationEmail(email: string) {
    const auth = this.getAuth();
    try {
      const res = await (auth.api as any).sendVerificationOTP({
        body: { email, type: 'email-verification' },
      });
      return res;
    } catch (e) {
      if (e instanceof Error) {
        console.error(pe.render(e), 'Failed to send verification email:', e);
      } else {
        console.error('Failed to send verification email:', e);
      }
      throw e;
    }
  }

  public async verifyEmailOTP(email: string, otp: string) {
    const auth = this.getAuth();
    const res = await auth.api.verifyEmailOTP({
      body: { email, otp },
    });
    return res;
  }

  public async forgotPasswordOtp(email: string, otp: string) {
    try {
      const auth = this.getAuth();
      const res = await auth.api.checkVerificationOTP({
        body: {
          email,
          otp,
          type: 'forget-password',
        },
      });
      return res;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        logger.warn(`Failed to verify OTP for forgot password: ${error}`);
      }
    }
  }

  public async sendForgetPasswordEmail(email: string) {
    try {
      const auth = this.getAuth();
      logger.info(`Sending forget password email to ${email}`);
      const res = await auth.api.forgetPasswordEmailOTP({
        body: { email },
      });
      logger.info(`Forget password email sent to ${email}`);
      return res;
    } catch (error) {
      if (error instanceof Error) logger.error(error);
    }
  }

  public async resetPassword(
    data: {
      email: string;
      otp: string;
      password: string;
    },
    headers?: Headers,
  ) {
    const auth = this.getAuth();
    return await auth.api.resetPasswordEmailOTP({
      returnHeaders: true,
      body: { email: data.email, otp: data.otp, password: data.password },
      headers,
    });
  }

  public async signInEmail(
    data: { email: string; password: string },
    headers?: Headers,
  ) {
    const auth = this.getAuth();
    return await auth.api.signInEmail({
      returnHeaders: true,
      body: data,
      headers,
    });
  }

  public async signOut(headers: Headers) {
    const auth = this.getAuth();
    try {
      const result = await auth.api.signOut({ returnHeaders: true, headers });
      return result;
    } catch (e) {
      console.error('Sign out failed:', e);
      throw e;
    }
  }

  public async getSession(headers: Headers) {
    const auth = this.getAuth();
    try {
      return await auth.api.getSession({ headers });
    } catch (e) {
      console.error(e);
    }
  }
}
