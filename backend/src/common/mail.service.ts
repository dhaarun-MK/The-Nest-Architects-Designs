import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('SMTP_HOST'),
      port: +config.get('SMTP_PORT'),
      secure: false,
      auth: { user: config.get('SMTP_USER'), pass: config.get('SMTP_PASS') },
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    await this.transporter.sendMail({
      from: `"THE NEST ARCHITECTS" <${this.config.get('SMTP_USER')}>`,
      to,
      subject: 'Welcome to THE NEST ARCHITECTS',
      html: `<h2>Hello ${name},</h2><p>Thank you for visiting <strong>THE NEST ARCHITECTS</strong>.</p><p>We are excited to help you build your dream projects.</p><br/><p>Regards,<br/><strong>THE NEST ARCHITECTS</strong></p>`,
    });
  }

  async sendContactNotification(data: any) {
    await this.transporter.sendMail({
      from: `"THE NEST ARCHITECTS" <${this.config.get('SMTP_USER')}>`,
      to: this.config.get('ADMIN_EMAIL'),
      subject: `New Contact: ${data.subject}`,
      html: `<h3>New Contact Message</h3><p><strong>From:</strong> ${data.name} (${data.email})</p><p><strong>Subject:</strong> ${data.subject}</p><p><strong>Message:</strong><br/>${data.message}</p>`,
    });
  }
}
