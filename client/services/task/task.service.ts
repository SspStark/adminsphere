import axiosInstance from '../api/axios';
import { GetTaskResponse, Task, UpdateTaskInput } from '@/types/task.types';
import { API_ENDPOINTS } from '../api/endpoints';
import { CreateTaskSchema } from '@/schemas/task.schema';
import { ApiResponse } from '@/types/api-response.types';

type GetTaskParams = {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  sort?: string;
};

export const taskService = {
  async getTasks({ page, limit, status, priority, sort }: GetTaskParams): Promise<GetTaskResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.TASKS.BASE, {
      params: { page, limit, status, priority, sort },
    });
    return response.data;
  },

  async createTask(payload: CreateTaskSchema) {
    const response = await axiosInstance.post(API_ENDPOINTS.TASKS.BASE, payload);
    return response.data;
  },

  async updateTask(id: string, payload: UpdateTaskInput) {
    const response = await axiosInstance.patch(`${API_ENDPOINTS.TASKS.BASE}/${id}`, payload);
    return response.data;
  },

  async deleteTask(id: string) {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.TASKS.BASE}/${id}`);
    return response.data;
  },

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    const response = await axiosInstance.get(`${API_ENDPOINTS.TASKS.BASE}/${id}`);
    return response.data;
  },
};
