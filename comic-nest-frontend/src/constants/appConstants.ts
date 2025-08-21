export const appConstants = {
  APP_ROUTES: {
    HOME: "/",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    EMAIL_VERIFY: "/auth/email-verify",
    DASHBOARD: "/dashboard",
    PLANS: "/dashboard/plans",
    EXPLORE: "/dashboard/explore",
    FALLBACK: "*",
  },
  DEFAULT_API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  TRUTHY_FALSY_VALUES: {
    TRUE: true,
    FALSE: false,
    ONE: 1,
    ZERO: 0,
  },
  NEGATIVE_ONE: -1,
  PHONE_NUMBER_LENGTH: 10,
  OTP_DIGIT_LENGTH: 6,
  RESEND_WAIT_TIME: 130,
};
