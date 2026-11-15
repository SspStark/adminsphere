import ActivityLog from '../models/ActivityLog.js';
import logger from '../config/logger.js';

export const logActivity = async ({ userId, action, taskId, meta = {} }) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      task: taskId,
      meta,
    });
  } catch (error) {
    logger.error('Activity log failed:', error);
  }
};
