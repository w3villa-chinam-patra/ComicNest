const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    GOOGLE_OAUTH_LOGIN:"/auth/google",
    REGISTER: "/auth/register",
    VERIFY_EMAIL: (token: string) => `/auth/email-verify/${token}`,
    SEND_OTP_SMS: "/auth/send-otp-sms",
    IS_OTP_ALREADY_SENT: "/auth/is-otp-already-sent",
    VERIFY_OPT: "/auth/verify-otp",
    UPLOAD_PROFILE_PHOTO: `/auth/upload-profile-photo`,
    SKIP_UPLOAD_PROFILE_PHOTO: "/auth/upload-profile-photo-skip",
    LOGOUT: '/auth/logout'
  },
  USER: {
    GET_PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user",
  },
};

export default API_ENDPOINTS;
