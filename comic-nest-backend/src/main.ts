import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logger/winston.logger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  const logger = new Logger('Bootstrap')
  logger.log(`Server started at http://localhost:${PORT}`)
}
bootstrap();
