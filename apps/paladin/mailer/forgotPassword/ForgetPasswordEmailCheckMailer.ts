import { getMailer } from '@server/shared/mail/getMailer';
import type { Mailer } from '@server/shared/mail/types';
// import { renderTemplate } from '../renderers';
// import { ForgetPasswordEmailCheckTemplate } from './ForgetPasswordEmailCheckTemplate';

export class ForgetPasswordEmailCheckMailer {
  private readonly mailer: Mailer;
  constructor() {
    this.mailer = getMailer();
  }

  public async send(_config: { to: string; otp: string; lang?: string }) {
    // const html = await renderTemplate(
    //   ForgetPasswordEmailCheckTemplate({ otp: config.otp }),
    // );
    // await this.mailer.send({
    //   to: [config.to],
    //   subject: 'Reset your password',
    //   html,
    // });
    console.debug(this.mailer);
  }
}
