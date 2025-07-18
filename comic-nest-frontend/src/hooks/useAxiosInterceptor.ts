// src/hooks/useAxiosInterceptor.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosClient from "../api/axiosClient";
import { HttpStatusCode } from "axios";
import { appConstants } from "../constants";

export const useAxiosInterceptor = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          logout(); // clear auth state
          navigate(appConstants.APP_ROUTES.LOGIN, {
            replace: appConstants.TRUTHY_FALSY_VALUES.TRUE,
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosClient.interceptors.response.eject(interceptor); // cleanup
    };
  }, [logout, navigate]);
};
