export const NextAction = {
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  MOBILE_VERIFICATION: "MOBILE_VERIFICATION",
  PROFILE_COMPLETION: "PROFILE_COMPLETION",
  PHOTO_UPLOAD: "PHOTO_UPLOAD",
  NONE: "NONE",
} as const;

export type NextAction = (typeof NextAction)[keyof typeof NextAction];
