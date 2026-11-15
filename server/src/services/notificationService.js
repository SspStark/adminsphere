import Notification from '../models/Notification.js';

export const createNotification = async ({ recipient, type, title, message, task = null, actor = null }) => {
  const notification = await Notification.create({
    recipient,
    type,
    title,
    message,
    task,
    actor,
  });

  await notification.populate([
    {
      path: 'actor',
      select: 'firstName lastName username',
    },
    {
      path: 'task',
      select: 'title',
    },
  ]);

  return notification;
};

export const getNotifications = async (userId, query = {}) => {
  const { page = 1, limit = 10 } = query;

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);

  const skip = (pageNumber - 1) * limitNumber;

  const filter = {
    recipient: userId,
  };

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .populate('actor', 'firstName lastName username')
      .populate('task', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),

    Notification.countDocuments(filter),
  ]);

  return { data: notifications, total, page: pageNumber, pages: Math.ceil(total / limitNumber) };
};

export const getUnreadCount = async (userId) => {
  return Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });
};

export const markNotificationAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient: userId,
    },
    {
      isRead: true,
    },
    {
      new: true,
    }
  );
};

export const markAllNotificationsAsRead = async (userId) => {
  const result = await Notification.updateMany(
    {
      recipient: userId,
      isRead: false,
    },
    {
      isRead: true,
    }
  );

  return result.modifiedCount;
};
