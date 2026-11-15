import axiosInstance from '../api/axios';
import { API_ENDPOINTS } from '../api/endpoints';

export const attachmentService = {
  async addAttachment(taskId: string, files: File[]) {
    const formData = new FormData();

    files.forEach((file) => formData.append('attachments', file));

    const response = await axiosInstance.post(`${API_ENDPOINTS.TASKS.BASE}/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async deleteAttachment(taskId: string, attachmentId: string) {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.TASKS.BASE}/${taskId}/attachments/${attachmentId}`);
    return response.data;
  },
};
