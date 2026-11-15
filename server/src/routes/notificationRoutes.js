import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, notificationController.getNotifications);

router.get('/unread-count', authMiddleware, notificationController.getUnreadCount);

router.patch('/:id/read', authMiddleware, notificationController.markNotificationAsRead);

router.patch('/read-all', authMiddleware, notificationController.markAllNotificationsAsRead);

export default router;
