import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { appConstants, successMessages } from '../constants';
import { Request } from 'express';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        const responsePayload = {
          isSuccess: appConstants.TRUTHY_FALSY_VALUES.TRUE,
          message: data?.message || successMessages.SUCCESS_RESPONSE,
          data: data?.data ?? [],
        };

        // Log the successful response with request info
        this.logger.log(
          `[${req.method}] [${req.originalUrl}]: ${responsePayload.message}`,
        );

        return responsePayload;
      }),
    );
  }
}
