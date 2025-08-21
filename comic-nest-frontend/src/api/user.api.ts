import API_ENDPOINTS from "./api-endpoints";
import axiosClient from "./axiosClient";

export const getProfile = async () => {
  try {
    const response = await axiosClient.get(API_ENDPOINTS.USER.GET_PROFILE);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const updateProfile = async (body: object) => {
  try {
    const response = await axiosClient.patch(
      API_ENDPOINTS.USER.UPDATE_PROFILE,
      body
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};
