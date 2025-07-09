import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { appConstants, errorMessages } from '../constants';
import { AppError } from '../errors';
import { ErrorResponse } from '../types';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let statusCode: number = errorMessages.INTERNAL_SERVER_ERROR.statusCode;
    let message: string = errorMessages.INTERNAL_SERVER_ERROR.message;

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
        message = r.message || message;
      }
    }

    const errorResponse: ErrorResponse = {
      isSuccess: appConstants.TRUTHY_FALSY_VALUES.FALSE,
      message,
    };

    res.status(statusCode).json(errorResponse);
  }
}
