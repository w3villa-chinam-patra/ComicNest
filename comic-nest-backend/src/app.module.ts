import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join, resolve } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { appConstants } from './common/constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: appConstants.TRUTHY_FALSY_VALUES.TRUE,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const isProd = cfg.get('NODE_ENV') === appConstants.PRODUCTION_ENV;

        return {
          transport: {
            host: cfg.get('SMTP_HOST'),
            port: +cfg.get('SMTP_PORT'),
            auth: {
              user: cfg.get('SMTP_USER'),
              pass: cfg.get('SMTP_PASSWORD'),
            },
          },
          defaults: {
            from: `"${cfg.get('MAIL_FROM_NAME')}" <${cfg.get('MAIL_FROM_EMAIL')}>`,
          },
          template: {
            dir: join(
              process.cwd(),
              isProd ? 'dist' : 'src',
              'common',
              'templates',
            ),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: appConstants.TRUTHY_FALSY_VALUES.TRUE,
            },
          },
        };
      },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const secret = cfg.get<string>('JWT_SECRET');
        if (!secret) {
          new Logger().error('JWT_SECRET is missing in environment variables');
        }
        return {
          secret,
        };
      },
    }),
    AuthModule,
    DatabaseModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
