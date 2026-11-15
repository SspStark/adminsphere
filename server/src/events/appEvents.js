import EventEmitter from 'events';
import { socketEmitter } from '../integrations/socket/socketEmitter.js';
import { logActivity } from '../services/activityLogService.js';
import { sendTaskUpdatesEmail } from '../integrations/mailService.js';
import logger from '../config/logger.js';
import { createNotification } from '../services/notificationService.js';

const appEvents = new EventEmitter();

const getUserId = (value) => {
  if (!value) return null;

  return value._id?.toString() ?? value.toString();
};

const emitTaskRealtimeUpdate = ({ action, task, affectedUserIds }) => {
  const taskId = task._id.toString();

  const userIds = new Set();

  // Current assignee
  const assignedToId = getUserId(task.assignedTo);

  if (assignedToId) {
    userIds.add(assignedToId);
  }

  // Previously affected users, e.g. previous assignee
  for (const userId of affectedUserIds) {
    if (userId) {
      userIds.add(userId.toString());
    }
  }

  // Users who are directly affected by this task
  if (userIds.size > 0) {
    socketEmitter.emitToUsers([...userIds], 'TASK_UPDATED', { action, taskId });

    socketEmitter.emitToUsers([...userIds], 'DASHBOARD_UPDATED', { action, taskId });
  }

  // Users with permission to view all tasks
  socketEmitter.emitToRoom('dashboard', 'TASK_UPDATED', { action, taskId });

  socketEmitter.emitToRoom('dashboard', 'DASHBOARD_UPDATED', { action, taskId });
};

appEvents.on('TASK_CHANGED', ({ action, task, affectedUserIds = [] }) => {
  try {
    emitTaskRealtimeUpdate({ action, task, affectedUserIds });
  } catch (error) {
    logger.error('TASK_CHANGED event failed:', error);
  }
});

appEvents.on('TASK_ASSIGNMENT_CHANGED', async ({ task, assignedTo, previousAssignee, assignedBy }) => {
  try {
    // New assignee: assigned or reassign
    if (assignedTo) {
      const notification = await createNotification({
        recipient: assignedTo._id,
        type: 'TASK_ASSIGNED',
        title: 'Task assigned',
        message: `You were assigned a new task: ${task.title}`,
        task: task._id,
        actor: assignedBy._id,
      });

      socketEmitter.emitToUser(assignedTo._id.toString(), 'NOTIFICATION_CREATED', {
        notification,
      });

      await Promise.all([
        logActivity({
          userId: assignedBy._id,
          action: 'TASK_ASSIGNED',
          taskId: task._id,
          meta: { assignedTo: assignedTo._id },
        }),
        sendTaskUpdatesEmail({
          update: 'TASK_ASSIGNED',
          title: task.title,
          taskId: task._id,
          assignedTo,
          updatedBy: assignedBy,
        }),
      ]);
    }

    // Previous assignee: reassigned or unassigned
    if (previousAssignee) {
      const isUnassigned = !assignedTo;

      const notificationType = isUnassigned ? 'TASK_UNASSIGNED' : 'TASK_REASSIGNED';
      const notificationTitle = isUnassigned ? 'Task Unassigned' : 'Task Reassigned';

      const activityAction = isUnassigned ? 'TASK_UNASSIGNED' : 'TASK_REASSIGNED';

      const message = isUnassigned
        ? `The task "${task.title}" is no longer assigned to you.`
        : `The task "${task.title}" was reassigned to another user.`;

      const notification = await createNotification({
        recipient: previousAssignee._id,
        type: notificationType,
        title: notificationTitle,
        message,
        task: task._id,
        actor: assignedBy._id,
      });

      socketEmitter.emitToUser(previousAssignee._id.toString(), 'NOTIFICATION_CREATED', {
        notification,
      });

      await Promise.all([
        logActivity({
          userId: assignedBy._id,
          action: activityAction,
          taskId: task._id,
          meta: { previousAssignee: previousAssignee._id, assignedTo: assignedTo?._id ?? null },
        }),
        sendTaskUpdatesEmail({
          update: notificationType,
          title: task.title,
          taskId: task._id,
          assignedTo: previousAssignee,
          updatedBy: assignedBy,
        }),
      ]);
    }
  } catch (error) {
    logger.error('TASK_ASSIGNMENT_CHANGED event failed:', error);
  }
});

export default appEvents;
