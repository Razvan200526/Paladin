// import { renderTemplate } from '../renderers';
// import { ForgetPasswordEmailCheckTemplate } from './ForgetPasswordEmailCheckTemplate';

import type { Mailer } from '@sdk/types';
import { getMailer } from '../getMailer';

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
