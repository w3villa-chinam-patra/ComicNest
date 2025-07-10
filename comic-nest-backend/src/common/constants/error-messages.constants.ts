import { HttpStatus } from '@nestjs/common';

export const errorMessages = {
  INTERNAL_SERVER_ERROR: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message:
      'An unexpected error occurred on the server. Please try again later or contact support if the issue persists.',
  },
  INVALID_BODY_PARAMS: {
    message: 'Request body contains invalid or missing fields.',
  },
  INVALID_URL_PARAMS: {
    message: 'Invalid or missing URL parameters.',
  },
};
