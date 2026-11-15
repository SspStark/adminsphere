import axiosInstance from '../api/axios';
import { API_ENDPOINTS } from '../api/endpoints';

export type DashboardActivity = {
  _id: string;
  action: string;
  createdAt: string;
  user: {
    _id: string;
    firstName: string;
    lastName?: string;
    username: string;
  };
  task?: {
    _id: string;
    title: string;
  };
  meta: Record<string, unknown>;
};

export type DashboardStats = {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  activeUsers: number | null;
  recentActivity: DashboardActivity[];
};

export const dashboardService = {
  async getStats(): Promise<{ success: boolean; data: DashboardStats }> {
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.STATS);

    return response.data;
  },
};
