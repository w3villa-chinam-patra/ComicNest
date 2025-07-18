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
  UNAUTHORIZED_ACCESS: {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: 'Unauthorized access. Please log in to continue.',
  },
  MUST_BE_GREATER_THAN_ZERO: {
    message: 'Number of digits must be greater than 0',
  },
  MISSING_TWILIO_PHONE_NUMBER: {
    message:
      'Twilio phone number is not configured. Set TWILIO_PHONE_NUMBER in environment variables.',
  },
  
};
