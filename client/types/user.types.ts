import { Role, AssignableRole } from '@/constants/roles';

type ProfileImage = {
  url: string;
  publicId: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  profileImage?: ProfileImage;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  permissions: string[];
};

export type GetUsersResponse = {
  success: boolean;
  count: number;
  users: User[];
};

export type UserActions = {
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
};

export type AssignableUser = Omit<User, 'role'> & {
  role: AssignableRole;
};
