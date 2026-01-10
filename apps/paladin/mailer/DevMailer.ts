import { logger } from '@razvan11/paladin';
import type { Mailer, SendMailParams } from '@sdk/types';
import nodemailer from 'nodemailer';

export class DevMailer implements Mailer {
  private transporter = nodemailer.createTransport({
    url: 'smtp://localhost:1025',
  });

  async send({
    to,
    subject,
    html,
    fromEmail,
    fromName,
  }: SendMailParams): Promise<void> {
    logger.info('sending email');
    const from = `${fromName || 'Paladin'} <${fromEmail || Bun.env.MAIL_FROM || 'no-reply@Paladin'}>`;
    const result = await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    logger.info(
      `[DevMailer] : Result from sendMail - ${JSON.stringify(result)}`,
    );
  }
}
