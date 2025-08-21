import axios from "axios";
import { appConstants } from "../constants";

const axiosClient = axios.create({
  baseURL: appConstants.DEFAULT_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosClient;
