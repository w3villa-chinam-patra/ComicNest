import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { appConstants, successMessages } from '../constants';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          isSuccess: appConstants.TRUTHY_FALSY_VALUES.TRUE,
          message: data?.message || successMessages.SUCCESS_RESPONSE,
          data: data?.data ?? data,
        };
      }),
    );
  }
}
