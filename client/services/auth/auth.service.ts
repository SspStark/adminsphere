import axiosInstance from '../api/axios';
import { API_ENDPOINTS } from '../api/endpoints';
import { LoginResponse } from '@/types/auth.types';
import { User } from '@/types/user.types';

type LoginPayload = {
  identifier: string;
  password: string;
};

type ForgotPasswordPayload = {
  email: string;
};

type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, payload);
    return response.data;
  },

  async me(): Promise<User> {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
    return response.data.user;
  },

  async logout() {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  async forgotPassword(payload: ForgotPasswordPayload) {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
    return response.data;
  },

  async resetPassword(payload: ResetPasswordPayload) {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
    return response.data;
  },
};
