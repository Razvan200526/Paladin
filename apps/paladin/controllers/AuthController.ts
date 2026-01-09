import { isEmailValid } from '@common/validators/isEmailValid';
import { apiResponse } from '@paladin/client';
import type { ResetPasswordModel } from '@paladin/models/ResetPasswordModel';
import type { SignUpModel } from '@paladin/models/SignUpModel';
import { controller, get, inject, logger, post } from '@razvan11/paladin';
import type { Context } from 'hono';
import { UserRepository } from '../repositories/UserRepository';
import { AuthService } from '../services/AuthService';

@controller('/api/auth')
export class AuthController {
  constructor(
    @inject(AuthService) private readonly authService: AuthService,
    @inject(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  @get('/reference')
  async getOpenAPIReference(c: Context) {
    const auth = this.authService.getAuth();
    return auth.handler(c.req.raw);
  }

  // POST /api/auth/signup/email
  @post('/signup/email')
  async signupEmail(c: Context) {
    const payload = await c.req.json<SignUpModel>();
    try {
      const response = await this.authService.signup({ ...payload });
      return c.json({
        success: true,
        user: response.response.user,
      });
    } catch (e) {
      console.error(e);
      return c.json({ success: false, error: 'Failed to signup' }, 500);
    }
  }

  // POST /api/auth/signup/check-otp
  @post('/signup/check-otp')
  async signupCheckOtp(c: Context) {
    const email = c.req.query('email');
    const code = c.req.query('code');

    if (!email || !code) {
      return c.json(
        {
          data: { error: 'Email and code are required', success: false },
          message: 'Email and code are required',
        },
        400,
      );
    }

    try {
      await this.authService.verifyEmailOTP(email, code);
      return c.json({
        data: { error: '', success: true },
        message: 'OTP verified successfully',
      });
    } catch (error) {
      console.error('Error in signupCheckOtp:', error);
      if (error instanceof Error) {
        return c.json(
          {
            data: { error: error.message, success: false },
            message: error.message,
          },
          400,
        );
      }
      return c.json(
        {
          data: { error: 'Invalid OTP', success: false },
          message: 'Invalid OTP',
        },
        400,
      );
    }
  }

  // POST /api/auth/email-otp/send-verification-otp
  @post('/email-otp/send-verification-otp')
  async sendVerificationOtp(c: Context) {
    try {
      const { email } = await c.req.json();
      await this.authService.sendVerificationEmail(email);
      return c.json({ success: true }, 200);
    } catch (e) {
      console.error('Error in sendVerificationOtp:', e);
      return c.json({ success: false, error: 'Failed to send OTP' }, 500);
    }
  }

  // POST /api/auth/signin/email
  @post('/signin/email')
  async signinEmail(c: Context) {
    const { email, password } = await c.req.json();
    try {
      const result = await this.authService.signInEmail(
        { email, password },
        c.req.raw.headers,
      );

      const setCookieHeader = result.headers.get('Set-Cookie');
      if (setCookieHeader) {
        c.header('Set-Cookie', setCookieHeader);
      }
      return apiResponse(c, {
        data: {
          user: result.response.user,
          token: result.response.token,
        },
        success: true,
        message: 'User signed in successfully',
      });
    } catch (e) {
      if (e instanceof Error)
        return apiResponse(
          c,
          {
            data: { user: null, token: null },
            isClientError: false,
            isServerError: false,
            success: false,
            message: 'Something went wrong',
          },
          401,
        );
    }
  }

  // GET /api/auth/signout
  @get('/signout')
  async signout(c: Context) {
    try {
      const result = await this.authService.signOut(c.req.raw.headers);

      const setCookieHeader = result.headers.get('Set-Cookie');
      if (setCookieHeader) {
        c.header('Set-Cookie', setCookieHeader);
      }

      return c.json({ success: result.response.success, data: null });
    } catch (e) {
      console.error('Signout error:', e);
      return c.json({ success: false, error: 'Signout failed' }, 500);
    }
  }

  // GET /api/auth/session
  @get('/session')
  async getSession(c: Context) {
    try {
      const session = await this.authService.getSession(c.req.raw.headers);
      if (!session?.user?.id) {
        return c.json({ data: { user: null }, success: true });
      }
      const freshUser = await this.userRepo.findOne(session.user.id);
      return c.json({ data: { user: freshUser || null }, success: true });
    } catch (e) {
      console.error(e);
      return c.json(
        {
          data: { user: null },
          message: 'Failed to retrieve session',
        },
        500,
      );
    }
  }

  // POST /api/auth/forget-password/email
  @post('/forget-password/email')
  async forgetPasswordEmail(c: Context) {
    const payload = await c.req.json();
    const result = await this.authService.sendForgetPasswordEmail(
      payload.email,
    );
    return c.json({ data: result ?? null, success: true }, 201);
  }

  @post('/forget-password/check-otp')
  async checkOtp(c: Context) {
    try {
      const payload = await c.req.json();
      const { email, otp } = payload;

      if (!isEmailValid(email)) {
        return apiResponse(c, {
          data: null,
          isClientError: true,
          message: 'Invalid email',
        });
      }
      if (!otp) {
        return apiResponse(c, {
          data: null,
          isClientError: true,
          message: 'Invalid otp',
        });
      }

      const result = await this.authService.forgotPasswordOtp(email, otp);
      if (result) {
        return apiResponse(c, {
          data: result,
          isClientError: false,
          message: 'OTP verified',
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
      } else {
        console.error(error);
        logger.error(new Error('Unknown error in checkOtp'));
      }
      return apiResponse(c, {
        data: null,
        isClientError: true,
        message: 'Failed to verify OTP',
      });
    }
  }
  // POST /api/auth/forgot-password/reset-password
  @post('/forgot-password/reset-password')
  async resetPassword(c: Context) {
    try {
      const payload = await c.req.json<ResetPasswordModel>();
      const result = await this.authService.resetPassword(payload);
      return apiResponse(c, {
        data: result,
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      logger.error(error as Error);
      return apiResponse(c, {
        data: null,
        success: false,
        message: 'Failed to reset password',
      });
    }
  }
}
