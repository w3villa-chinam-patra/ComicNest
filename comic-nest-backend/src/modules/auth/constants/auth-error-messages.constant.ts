import { HttpStatus } from '@nestjs/common';

export const authErrorMessages = {
  EMAIL_ALREADY_REGISTERED: {
    statusCode: HttpStatus.CONFLICT,
    message:
      'This email is already registered. Please use a different email or log in.',
  },
  EMAIL_VERIFICATION_USER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    message:
      'User associated with this email verification link does not exist.',
  },
  EMAIL_VERIFICATION_LINK_EXPIRED: {
    statusCode: HttpStatus.GONE,
    message:
      'The email verification link has expired. Please request a new one.',
  },
  EMAIL_VERIFICATION_LINK_INVALID: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'The email verification link is invalid.',
  },
  EMAIL_VERIFICATION_FAILED: {
    message:
      'Unable to verify your email at this time. Please try again or request a new verification link.',
  },
  EMAIL_ALREADY_VERIFIED: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Your email has already been verified.',
  },
  EMAIL_VERIFICATION_EXPIRED_NEW_LINK_SENT: {
    statusCode: HttpStatus.GONE,
    message:
      'Your email verification link has expired. A new verification link has been sent to your email address.',
  },
  EMAIL_NOT_FOUND_PLEASE_REGISTER: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'No email found. Please register first.',
  },
  INVALID_PASSWORD: {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: 'The password you entered is incorrect.',
  },
  FAILED_TO_SEND_OTP: {
    message: 'Unable to send the OTP at this time. Please try again later.',
  },
  INVALID_MOBILE_NUMBER: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Please enter a valid phone number.',
  },
  OTP_ALREADY_SENT: {
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    message:
      'OTP has already been sent. Please wait 2 minutes before requesting a new one.',
  },
  OTP_RETRY_LIMIT_EXCEEDED: {
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    message:
      'You have exceeded the maximum number of OTP retry attempts. Please try again later.',
  },
  OTP_EXPIRED: {
    statusCode: HttpStatus.GONE,
    message: 'The OTP has expired. Please request a new one to continue.',
  },
  INVALID_OTP: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'The OTP you entered is incorrect. Please check and try again.',
  },
  FAILED_TO_VERIFY_OTP: {
    statusCode: HttpStatus.BAD_REQUEST,
    message:
      'Failed to verify OTP. Please ensure the OTP is correct and try again.',
  },
  OTP_NOT_SENT: {
    statusCode: HttpStatus.BAD_REQUEST,
    message:
      'No OTP has been sent to your mobile number yet. Please request an OTP to proceed.',
  },
  MOBILE_ALREADY_VERIFIED: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Phone number is already verified.',
  },
  FAILED_TO_UPLOAD_PROFILE_PHOTO: {
    message:
      'Failed to upload profile photo. Please try again later or contact support.',
  },
  FAILED_TO_SKIP_UPDATE_PROFILE_PHOTO: {
    message:
      'Failed to update profile photo. Please try again later or contact support.',
  },
  FAILED_TO_LOGIN: {
    message: 'Failed to login.',
  },
  PHONE_NUMBER_IN_USE: {
    statusCode: HttpStatus.CONFLICT,
    message:
      'This phone number is already registered. Please try another.',
  },
};
