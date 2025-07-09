import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logger/winston.logger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common/interceptors';

async function bootstrap() {
  // logger config
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });

  // env config
  const configService = app.get(ConfigService);

  // use of response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  const PORT = configService.get('PORT') || 3000;
  await app.listen(PORT);

  const logger = new Logger('Bootstrap');
  logger.log(`Server started at http://localhost:${PORT}`);
}
bootstrap();
