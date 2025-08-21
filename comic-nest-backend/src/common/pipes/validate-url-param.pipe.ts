import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { AppError } from '../errors';
import { errorMessages } from '../constants';

export class ValidateUrlParamPipe implements PipeTransform {
  constructor(private readonly paramName: string) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null || value === '') {
      throw new AppError(errorMessages.INVALID_URL_PARAMS);
    }
    return value;
  }
}
