import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { appConstants, errorMessages } from '../constants';
import { AppError } from '../errors';
import { ErrorResponse } from '../types';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let statusCode: number = errorMessages.INTERNAL_SERVER_ERROR.statusCode;
    let message: string = errorMessages.INTERNAL_SERVER_ERROR.message;
    let logErrorMessage: string | null = null;
    if (exception instanceof AppError) {
      statusCode = exception.statusCode;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object') {
        const r = response as any;
        if (Array.isArray(r.message)) {
          message = r.message[0] || message;
        } else {
          message = r.message || message;
        }
      }
    } else if (exception instanceof Error) {
      logErrorMessage = exception.message;
    }

    const errorResponse: ErrorResponse = {
      isSuccess: appConstants.TRUTHY_FALSY_VALUES.FALSE,
      message,
      statusCode
    };

    // Log with contextual details
    this.logger.error(
      `[${req.method}] [${req.originalUrl}]: ${logErrorMessage || message}`,
    );

    res.status(statusCode).json(errorResponse);
  }
}
