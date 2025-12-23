import { getMailer } from '@server/shared/mail/getMailer';
import type { Mailer } from '@server/shared/mail/types';
import { renderTemplate } from '../renderers';
import { SignupEmailCheckTemplate } from './SignupEmailCheckTemplate';

export class SignupEmailCheckMailer {
  private readonly mailer: Mailer;
  constructor() {
    this.mailer = getMailer();
  }

  public async send(config: { to: string; otp: string; lang?: string }) {
    const html = await renderTemplate(
      SignupEmailCheckTemplate({ otp: config.otp }),
    );
    try {
      await this.mailer.send({
        to: [config.to],
        subject: 'Verify your email',
        html,
      });
    } catch (e) {
      console.error('Failed to send OTP email:', e);
      throw e;
    }
  }
}
