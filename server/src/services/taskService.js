import Task from '../models/Task.js';
import User from '../models/User.js';
import { TaskError } from '../errors/appError.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../integrations/imageService.js';
import { logActivity } from './activityLogService.js';
import appEvents from '../events/appEvents.js';

import { canManageTask, isTaskAssignee } from '../policies/taskPolicy.js';
import { hasPermission } from '../policies/commonPolicy.js';
import { PERMISSIONS } from '../constants/permissions.js';

const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new TaskError('User not found', 404);
  }

  return user;
};

export const createTask = async (body, user, files = []) => {
  const { title, description, priority, dueDate, assignedTo } = body;

  if (!title) {
    throw new TaskError('Title is required', 400);
  }

  let assignedUser = null;
  if (assignedTo) {
    assignedUser = await getUserById(assignedTo);
    if (!assignedUser) {
      throw new TaskError('Assigned user not found', 404);
    }
  }

  // Upload attachments
  const attachments = [];
  if (files.length > 0) {
    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer, 'adminsphere/task-attachments');
      attachments.push({
        url: result.secure_url,
        publicId: result.public_id,
        fileName: file.originalname,
        fileType: file.mimetype,
        resourceType: result.resource_type,
        fileSize: file.size,
      });
    }
  }

  // Create Task
  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    createdBy: user._id,
    assignedTo: assignedUser || null,
    assignedBy: assignedTo ? user._id : null,
    attachments,
  });
  await logActivity({ userId: user._id, action: 'TASK_CREATED', taskId: task._id });

  appEvents.emit('TASK_CHANGED', { action: 'created', task });

  if (assignedUser) {
    const assignedBy = await getUserById(user._id);

    appEvents.emit('TASK_ASSIGNMENT_CHANGED', {
      task,
      assignedTo: assignedUser,
      previousAssignee: null,
      assignedBy,
    });
  }

  if (attachments.length > 0) {
    await logActivity({ userId: user._id, action: 'ATTACHMENT_ADDED', taskId: task._id });
  }
  return task;
};

export const getTasks = async (query, user) => {
  let { page = 1, limit = 10, status, priority, assignedTo, sort = '-createdAt' } = query;
  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  // Base filter
  let filter = { isDeleted: false };

  // Role based filter
  if (!hasPermission(user, PERMISSIONS.TASK.VIEW_ALL)) {
    filter.assignedTo = user._id;
  } else if (assignedTo) {
    const users = assignedTo.split(',');
    filter.assignedTo = { $in: users };
  }

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  // Query
  const tasks = await Task.find(filter)
    .populate('assignedTo', 'firstName lastName email username role')
    .populate('assignedBy', 'firstName lastName')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Total Documents
  const total = await Task.countDocuments(filter);

  return { total, page, pages: Math.ceil(total / limit), data: tasks };
};

export const updateTask = async (taskId, data, user) => {
  const task = await Task.findById(taskId);
  if (!task || task.isDeleted) {
    throw new TaskError('Task not found', 400);
  }

  const oldStatus = task.status;
  const previousAssigneeId = task.assignedTo?.toString() ?? null;

  let assignmentEvent = null;

  // Employee restriction
  if (!hasPermission(user, PERMISSIONS.TASK.UPDATE)) {
    if (!isTaskAssignee(task, user)) {
      throw new TaskError('Not authorised', 403);
    }

    const allowedFields = ['status'];

    const hasUnauthorizedField = Object.keys(data).some((field) => !allowedFields.includes(field));

    if (hasUnauthorizedField) {
      throw new TaskError('Employees can only update task status', 403);
    }

    const allowedStatus = ['pending', 'in-progress', 'completed'];

    if (data.status && allowedStatus.includes(data.status)) {
      task.status = data.status;
    }
  } else {
    const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'];
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        task[field] = data[field];
      }
    });

    if (data.assignedTo !== undefined) {
      if (data.assignedTo === null) {
        if (previousAssigneeId) {
          const previousAssignee = await getUserById(previousAssigneeId);
          const assignedBy = await getUserById(user._id);
          assignmentEvent = {
            task,
            assignedTo: null,
            previousAssignee,
            assignedBy,
          };
        }
        task.assignedTo = null;
        task.assignedBy = null;
      } else {
        const userExists = await getUserById(data.assignedTo);
        if (!userExists) throw new TaskError('Invalid assigned user', 400);

        const isChanged = data.assignedTo !== task.assignedTo?.toString();
        if (isChanged) {
          let previousAssignee = null;
          if (previousAssigneeId) {
            previousAssignee = await getUserById(previousAssigneeId);
          }

          const assignedBy = await getUserById(user._id);

          task.assignedTo = data.assignedTo;
          task.assignedBy = user._id;
          assignmentEvent = {
            task,
            assignedTo: userExists,
            previousAssignee,
            assignedBy,
          };
        }
      }
    }
  }

  task.updatedBy = user._id;

  if (data.status && oldStatus !== task.status) {
    await logActivity({
      userId: user._id,
      action: task.status === 'completed' ? 'TASK_COMPLETED' : 'TASK_UPDATED',
      taskId,
      meta: { oldStatus, newStatus: task.status },
    });
  }

  await task.save();

  appEvents.emit('TASK_CHANGED', {
    action: 'updated',
    task,
    affectedUserIds: assignmentEvent?.previousAssignee ? [assignmentEvent.previousAssignee._id] : [],
  });

  if (assignmentEvent) {
    appEvents.emit('TASK_ASSIGNMENT_CHANGED', assignmentEvent);
  }

  return task;
};

export const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);

  if (!task || task.isDeleted) {
    throw new TaskError('Task not found', 404);
  }

  task.isDeleted = true;
  task.updatedBy = userId;

  await task.save();

  await logActivity({ userId, action: 'TASK_DELETED', taskId });

  appEvents.emit('TASK_CHANGED', { action: 'deleted', task });
};

export const getTaskById = async (taskId) => {
  const task = await Task.findOne({ _id: taskId, isDeleted: false })
    .populate('assignedTo', 'firstName lastName email username')
    .populate('assignedBy', 'firstName lastName')
    .populate('comments.user', 'firstName lastName username email profileImage');

  if (!task) {
    throw new TaskError('Task not found', 404);
  }

  return task;
};

export const addComment = async (taskId, message, userId) => {
  const task = await Task.findById(taskId);

  if (!task || task.isDeleted) {
    throw new TaskError('Task not found', 404);
  }

  if (!message) throw new TaskError('Comment message required', 400);

  const comment = {
    user: userId,
    message,
  };

  task.comments.push(comment);
  await task.save();

  await logActivity({ userId, action: 'COMMENT_ADDED', taskId });

  appEvents.emit('TASK_CHANGED', { action: 'updated', task });

  return task.comments[task.comments.length - 1];
};

export const updateComment = async (taskId, commentId, message, userId) => {
  const task = await Task.findById(taskId);
  if (!task || task.isDeleted) throw new TaskError('Task not found', 404);

  const comment = task.comments.id(commentId);
  if (!comment) throw new TaskError('Comment not found', 404);

  if (comment.user.toString() !== userId.toString()) {
    throw new TaskError('Not Authorized', 403);
  }

  comment.message = message;
  comment.updatedAt = new Date();

  await task.save();

  await logActivity({ userId, action: 'COMMENT_UPDATED', taskId });

  appEvents.emit('TASK_CHANGED', { action: 'updated', task });

  return comment;
};

export const deleteComment = async (taskId, commentId, userId) => {
  const task = await Task.findById(taskId);
  if (!task || task.isDeleted) throw new TaskError('Task not found', 404);

  const comment = task.comments.id(commentId);
  if (!comment) throw new TaskError('Comment not found', 404);

  if (comment.user.toString() !== userId.toString()) {
    throw new TaskError('Not Authorized', 403);
  }

  comment.deleteOne();

  await task.save();

  await logActivity({ userId, action: 'COMMENT_DELETED', taskId });

  appEvents.emit('TASK_CHANGED', { action: 'updated', task });
};

export const addAttachments = async (taskId, user, files = []) => {
  const task = await Task.findById(taskId);
  if (!task || task.isDeleted) throw new TaskError('Task not found', 404);

  if (!files || files.length === 0) throw new TaskError('No files provided', 400);

  if (!canManageTask(user) && !isTaskAssignee(user, task)) {
    throw new TaskError('Not authorized', 403);
  }

  if (task.attachments.length + files.length > 10) {
    throw new TaskError('Max 10 attachments allowed', 400);
  }

  const result = await Promise.all(
    files.map((file) => uploadToCloudinary(file.buffer, 'adminsphere/task-attachments'))
  );

  const newAttachments = result.map((result, index) => {
    const file = files[index];

    return {
      url: result.secure_url,
      publicId: result.public_id,
      fileName: file.originalname,
      fileType: file.mimetype,
      resourceType: result.resource_type,
      fileSize: file.size,
    };
  });

  task.attachments.push(...newAttachments);

  task.updatedBy = user._id;

  await task.save();

  await logActivity({ userId: user._id, action: 'ATTACHMENT_ADDED', taskId });

  appEvents.emit('TASK_CHANGED', { action: 'updated', task });

  return newAttachments;
};

export const deleteAttachment = async (taskId, attachmentId, user) => {
  const task = await Task.findById(taskId);
  if (!task || task.isDeleted) throw new TaskError('Task not found', 404);

  const attachment = task.attachments.id(attachmentId);
  if (!attachment) throw new TaskError('Attachment not found', 404);

  if (!canManageTask(user) && !isTaskAssignee(user, task)) {
    throw new TaskError('Not authorized', 403);
  }

  await deleteFromCloudinary(attachment.publicId, attachment.resourceType);

  attachment.deleteOne();

  task.updatedBy = user._id;

  await task.save();

  await logActivity({ userId: user._id, action: 'ATTACHMENT_DELETED', taskId });

  appEvents.emit('TASK_CHANGED', { action: 'updated', task });
};
