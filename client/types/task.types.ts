import { User } from './user.types';
import { TaskStatus, TaskPriority } from '@/constants/task';

export type TaskComment = {
  _id: string;
  message: string;
  createdAt: string;
  updatedAt?: string | null;
  user: Pick<User, '_id' | 'firstName' | 'lastName' | 'username' | 'email' | 'role'>;
};

export type TaskAttachment = {
  _id: string;
  url: string;
  publicId: string;
  fileName: string;
  fileType: string;
  resourceType: string;
  fileSize?: number;
};

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignedTo?: Pick<User, '_id' | 'firstName' | 'lastName' | 'email' | 'username' | 'role'> | null;
  assignedBy?: {
    firstName: string;
    lastName: string;
  } | null;
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  createdAt?: string;
  updatedAt?: string;
};

export type GetTaskResponse = {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  data: Task[];
};

export type TaskActions = {
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedTo?: string | null;
};
