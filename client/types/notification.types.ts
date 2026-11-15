export type Notification = {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  task: {
    _id: string;
    title: string;
  } | null;
  actor: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
  } | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetNotificationsResponse = {
  success: boolean;
  data: Notification[];
  total: number;
  page: number;
  pages: number;
};

export type UnreadCountResponse = {
  success: boolean;
  data: {
    count: number;
  };
};
