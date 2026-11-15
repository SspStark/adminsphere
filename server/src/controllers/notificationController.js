import * as notificationService from '../services/notificationService.js';

export const getNotifications = async (req, res) => {
  const result = await notificationService.getNotifications(req.user._id, req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
};

export const getUnreadCount = async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user._id);

  res.status(200).json({
    success: true,
    data: {
      count,
    },
  });
};

export const markNotificationAsRead = async (req, res) => {
  const notification = await notificationService.markNotificationAsRead(req.params.id, req.user._id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
};

export const markAllNotificationsAsRead = async (req, res) => {
  const modifiedCount = await notificationService.markAllNotificationsAsRead(req.user._id);

  res.status(200).json({
    success: true,
    message: 'Notifications marked as read',
    data: {
      modifiedCount,
    },
  });
};
