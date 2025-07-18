import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { appConstants } from '../constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JWTService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createToken(payload: Record<string, any>, expiresIn: string | number) {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn,
      secret:
        this.configService.get<string>('JWT_SECRET') ||
        appConstants.DEFAULT_JWT_SECRET_KEY,
    });
    return { token, expiresIn };
  }

  async createEmailVerificationToken(payload: object) {
    return await this.createToken(
      payload,
      this.configService.get<string | number>(
        'MAIL_VERIFICATION_LINK_EXPIRES_IN',
      ) || appConstants.DEFAULT_MAIL_VERIFICATION_LINK_EXPIRES_IN,
    );
  }

  async createAccessToken(payload: object) {
    return await this.createToken(
      payload,
      this.configService.get('ACCESS_TOKEN_EXPIRES_IN') ||
        appConstants.DEFAULT_ACCESS_TOKEN_EXPIRES_IN,
    );
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret:
          this.configService.get('JWT_SECRET') ||
          appConstants.DEFAULT_JWT_SECRET_KEY,
      });
      return { valid: true, expired: false, payload };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return { valid: false, expired: true, payload: null };
      }

      // Handle all other JWT errors (invalid token, malformed, etc.)
      return { valid: false, expired: false, payload: null };
    }
  }
}
