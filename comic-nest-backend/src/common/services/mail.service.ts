// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmailVerification(email: string, token: string): Promise<void> {
    const url = `${this.configService.get('FRONTEND_BASE_URL')}/auth/email-verify?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'ComicNest | Verify Your Email to Get Started',
      template: './email-verification',
      context: {
        email,
        url,
      },
    });
  }
}
