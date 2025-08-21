import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';
import { errorMessages } from '../constants';

@Injectable()
export class TwilioService {
  private client: Twilio.Twilio;
  private fromPhone: string;

  constructor(private configService: ConfigService) {
    const sid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const token = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const fromPhone = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    if (!fromPhone) {
      throw new Error(errorMessages.MISSING_TWILIO_PHONE_NUMBER.message);
    }
    this.fromPhone = fromPhone;
    this.client = Twilio(sid, token);
  }

  async sendSms(to: string, otp: string) {
    return this.client.messages.create({
      to,
      from: this.fromPhone,
      body: `Comic Nest: Your mobile verification OTP is ${otp}. It will expire in 10 minutes. Do not share this code with anyone.`,
    });
  }
}
