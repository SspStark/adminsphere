import Task from '../models/Task.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { hasPermission } from '../policies/commonPolicy.js';
import { PERMISSIONS } from '../constants/permissions.js';

export const getDashboardStats = async (user) => {
  const canViewAll = hasPermission(user, PERMISSIONS.TASK.VIEW_ALL);

  const taskFilter = {
    isDeleted: false,
  };

  if (!canViewAll) {
    taskFilter.assignedTo = user._id;
  }

  const [totalTasks, pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
    Task.countDocuments(taskFilter),

    Task.countDocuments({
      ...taskFilter,
      status: 'pending',
    }),

    Task.countDocuments({
      ...taskFilter,
      status: 'in-progress',
    }),

    Task.countDocuments({
      ...taskFilter,
      status: 'completed',
    }),
  ]);

  const activeUsers = canViewAll ? await User.countDocuments({ isActive: true }) : null;

  const activityFilter = canViewAll ? {} : { user: user._id };

  const recentActivity = await ActivityLog.find(activityFilter)
    .populate('user', 'firstName lastName username')
    .populate('task', 'title')
    .sort('-createdAt')
    .limit(5)
    .lean();

  return {
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    activeUsers,
    recentActivity,
  };
};
