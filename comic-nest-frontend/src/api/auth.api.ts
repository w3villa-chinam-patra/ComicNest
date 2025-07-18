import { appConstants } from "../constants";
import API_ENDPOINTS from "./api-endpoints";
import axiosClient from "./axiosClient";

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const register = async (data: { email: string; password: string }) => {
  try {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const response = await axiosClient.get(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL(token)
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const sendOtpSms = async (mobileNumber: string) => {
  try {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.SEND_OTP_SMS, {
      mobileNumber,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const isOtpAlreadySent = async (mobileNumber: string) => {
  try {
    const response = await axiosClient.post(
      API_ENDPOINTS.AUTH.IS_OTP_ALREADY_SENT,
      { mobileNumber }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const verifyOtp = async (otp: string) => {
  try {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.VERIFY_OPT, {
      otp,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const uploadProfilePhoto = async (formData: FormData) => {
  try {
    const response = await axiosClient.post(
      API_ENDPOINTS.AUTH.UPLOAD_PROFILE_PHOTO,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const skipUploadProfilePhoto = async () => {
  try {
    const response = await axiosClient.post(
      API_ENDPOINTS.AUTH.SKIP_UPLOAD_PROFILE_PHOTO
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const logout = async () => {
  try {
    const response = await axiosClient.post(
      API_ENDPOINTS.AUTH.LOGOUT
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const googleOAuth = async () => {
  try {
    const response = await axiosClient.get(
      API_ENDPOINTS.AUTH.GOOGLE_OAUTH_LOGIN
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};