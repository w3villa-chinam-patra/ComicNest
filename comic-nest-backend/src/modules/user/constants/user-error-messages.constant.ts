import { HttpStatus } from '@nestjs/common';

export const userErrorMessages = {
  NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'User not found',
  },
};
