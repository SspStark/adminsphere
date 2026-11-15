import { User } from './user.types';

export type LoginResponse = {
  success: boolean;
  message: string;
  user: User;
};
