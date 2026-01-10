import type { Mailer, SendMailParams } from '@sdk/types';
import { color } from 'console-log-colors';
import { Resend } from 'resend';
export class PrimaryMailer implements Mailer {
  private apiKey: string;
  private resend: Resend;
  constructor() {
    console.debug(color.bgRedBright('Creating primary mailer'));

    this.apiKey = Bun.env.RESEND_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('Mail configuration error: RESEND_API_KEY is not set');
    }
    this.resend = new Resend(this.apiKey);
  }

  public async send({ to, subject, html }: SendMailParams): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: '"Paladin" <welcome@resumetracker.me>',
      to,
      subject,
      html,
    });
    if (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
