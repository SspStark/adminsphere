import axiosInstance from '../api/axios';
import { CreateCommentSchema } from '@/schemas/comment.schema';
import { API_ENDPOINTS } from '../api/endpoints';

export const commentService = {
  async createComment(taskId: string, payload: CreateCommentSchema) {
    const response = await axiosInstance.post(`${API_ENDPOINTS.TASKS.BASE}/${taskId}/comments`, payload);
    return response.data;
  },

  async updateComment(taskId: string, commentId: string, payload: CreateCommentSchema) {
    const response = await axiosInstance.post(`${API_ENDPOINTS.TASKS.BASE}/${taskId}/comments/${commentId}`, payload);
    return response.data;
  },

  async deleteComment(taskId: string, commentId: string) {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.TASKS.BASE}/${taskId}/comments/${commentId}`);
    return response.data;
  },
};
