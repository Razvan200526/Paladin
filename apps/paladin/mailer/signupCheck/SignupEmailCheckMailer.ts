import { logger } from '@razvan11/paladin';
import type { Mailer } from '@sdk/types';
import { getMailer } from '../getMailer';
import { renderTemplate } from '../renderers';
import { SignupEmailCheckTemplate } from './SignupEmailCheckTemplate';

export class SignupEmailCheckMailer {
  private readonly mailer: Mailer;
  constructor() {
    this.mailer = getMailer();
  }

  public async send(config: { to: string; otp: string; lang?: string }) {
    const html = renderTemplate(SignupEmailCheckTemplate({ otp: config.otp }));
    try {
      await this.mailer.send({
        to: [config.to],
        subject: 'Verify your email',
        html,
      });
    } catch (e) {
      if (e instanceof Error) logger.error(e);
      console.debug('here');
      console.error('Failed to send OTP email:', e);
    }
  }
}
