import axiosInstance from '../api/axios';
import { API_ENDPOINTS } from '../api/endpoints';
import { GetNotificationsResponse, UnreadCountResponse } from '@/types/notification.types';

export const notificationService = {
  async getNotifications(page = 1, limit = 20): Promise<GetNotificationsResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.BASE, {
      params: { page, limit },
    });

    return response.data;
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);

    return response.data;
  },

  async markAsRead(id: string) {
    const response = await axiosInstance.patch(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${id}/read`);

    return response.data;
  },

  async markAllAsRead() {
    const response = await axiosInstance.patch(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);

    return response.data;
  },
};
