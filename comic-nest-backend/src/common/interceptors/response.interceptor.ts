import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { appConstants, successMessages } from '../constants';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const responsePayload = {
          isSuccess: appConstants.TRUTHY_FALSY_VALUES.TRUE,
          statusCode: res.statusCode,
          message: data?.message || successMessages.SUCCESS_RESPONSE,
          data: data?.data ?? null,
        };

        this.logger.log(
          `[${req.method}] [${req.originalUrl}]: ${responsePayload.message}`,
        );

        return responsePayload;
      }),
    );
  }
}
