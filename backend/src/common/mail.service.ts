import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get("SMTP_HOST"),
      port: +config.get("SMTP_PORT"),
      secure: false,
      auth: { user: config.get("SMTP_USER"), pass: config.get("SMTP_PASS") },
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    await this.transporter.sendMail({
      from: `"THE NEST ARCHITECTS" <${this.config.get("SMTP_USER")}>`,
      to,
      subject: "Welcome to THE NEST ARCHITECTS",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">

      <!-- Header -->
      <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff;">THE NEST ARCHITECTS</h1>
        <p style="margin: 8px 0 0; color: #dcdcdc;">
          Designing Spaces. Inspiring Lives⭐.
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 30px; color: #333333; line-height: 1.6;">
        <h2>Hello ${name},</h2>

        <p>
          Thank you for visiting <strong>THE NEST ARCHITECTS</strong>.
        </p>

        <p>
          We are delighted to help you transform your ideas into inspiring architectural spaces.
        </p>

        <p>
          Our team looks forward to working with you on your next project.
        </p>

        <br>

        <p>
          Regards,<br>
          <strong>THE NEST ARCHITECTS</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #2c3e50; padding: 20px; text-align: center; font-size: 13px; color: #ffffff; border-top: 1px solid #dddddd;">
        <p style="margin: 0;">
          Thank you for choosing <strong>THE NEST ARCHITECTS</strong>.
        </p>

        <p style="margin: 8px 0;">
          Creating timeless architecture with innovation, quality, and excellence.
        </p>

        <p style="margin: 8px 0 0;">
          © 2026 THE NEST ARCHITECTS. All rights reserved.
        </p>

        <p style="margin: 5px 0 0;">
          This is an automated email. Please do not reply.
        </p>
      </div>

    </div>
  `,
    });
  }

  async sendContactNotification(data: any) {
    await this.transporter.sendMail({
      from: `"THE NEST ARCHITECTS" <${this.config.get("SMTP_USER")}>`,
      to: this.config.get("ADMIN_EMAIL"),
      subject: `New Contact: ${data.subject}`,
      html: `<h3>New Contact Message</h3><p><strong>From:</strong> ${data.name} (${data.email})</p><p><strong>Subject:</strong> ${data.subject}</p><p><strong>Message:</strong><br/>${data.message}</p>`,
    });
  }
}
