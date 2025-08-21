import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logger/winston.logger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common/interceptors';
import { AllExceptionsFilter } from './common/filters';
import { appConstants } from './common/constants';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // logger config
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });

  // env config
  const configService = app.get(ConfigService);

  // use of response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // use of exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // setting the global prefix
  app.setGlobalPrefix('api');

  // cors configuration
  app.enableCors({
    origin: configService.get<string>('FRONTEND_BASE_URL'),
    credentials: appConstants.TRUTHY_FALSY_VALUES.TRUE,
  });

  // cookie parser middleware enables cookie parsing
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: appConstants.TRUTHY_FALSY_VALUES.TRUE,
      forbidNonWhitelisted: appConstants.TRUTHY_FALSY_VALUES.TRUE,
      transform: appConstants.TRUTHY_FALSY_VALUES.TRUE,
    }),
  );

  const PORT = configService.get('PORT') || 3000;
  await app.listen(PORT);

  const logger = new Logger('Bootstrap');
  logger.log(`Server started at http://localhost:${PORT}`);
}
bootstrap();
