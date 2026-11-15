import axiosInstance from '../api/axios';
import { GetUsersResponse } from '@/types/user.types';
import { API_ENDPOINTS } from '../api/endpoints';
import { CreateUserSchema, UpdateUserSchema, UpdateMeSchema } from '@/schemas/user.schema';

export const userService = {
  async getUsers(): Promise<GetUsersResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS.BASE);
    return response.data;
  },

  async createUser(payload: CreateUserSchema) {
    const response = await axiosInstance.post(API_ENDPOINTS.USERS.BASE, payload);
    return response.data;
  },

  async updateUser(id: string, payload: UpdateUserSchema) {
    const response = await axiosInstance.patch(`${API_ENDPOINTS.USERS.BASE}/${id}`, payload);
    return response.data;
  },

  async deleteUser(id: string) {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.USERS.BASE}/${id}`);
    return response.data;
  },

  async getUserById(id: string) {
    const response = await axiosInstance.get(`${API_ENDPOINTS.USERS.BASE}/${id}`);
    return response.data;
  },

  async uploadAvatar(id: string, file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axiosInstance.patch(`${API_ENDPOINTS.USERS.BASE}/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteAvatar(id: string) {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.USERS.BASE}/${id}/avatar`);
    return response.data;
  },

  // Self
  async updateMe(payload: UpdateMeSchema) {
    const response = await axiosInstance.patch(API_ENDPOINTS.USERS.ME, payload);
    return response.data;
  },

  async changeMyPassword(payload: { currentPassword: string; newPassword: string }) {
    const response = await axiosInstance.patch(`${API_ENDPOINTS.USERS.ME}/password`, payload);
    return response.data;
  },

  async uploadMyAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axiosInstance.patch(`${API_ENDPOINTS.USERS.ME}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async deleteMyAvatar() {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.USERS.ME}/avatar`);

    return response.data;
  },
};
