import * as taskService from '../services/taskService.js';

export const createTask = async (req, res) => {
  const user = req.user;
  const body = req.body;
  const task = await taskService.createTask(body, user, req.files);
  res.status(201).json({ success: true, message: 'Task Created Successfully', data: task });
};

export const getTasks = async (req, res) => {
  const user = req.user;
  const query = req.query;
  const result = await taskService.getTasks(query, user);
  res.status(200).json({ success: true, ...result });
};

export const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const user = req.user;
  const body = req.body;
  const task = await taskService.updateTask(taskId, body, user);
  res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
};

export const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user?._id;
  await taskService.deleteTask(taskId, userId);
  res.status(200).json({ success: true, message: 'Task deleted successfully' });
};

export const getTaskById = async (req, res) => {
  const taskId = req.params.id;
  const task = await taskService.getTaskById(taskId);
  res.status(200).json({ success: true, data: task });
};

export const addComment = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user?._id;
  const { message } = req.body;
  const comment = await taskService.addComment(taskId, message, userId);
  res.status(201).json({ success: true, message: 'Comment added', data: comment });
};

export const updateComment = async (req, res) => {
  const { taskId, commentId } = req.params;
  const userId = req.user?._id;
  const { message } = req.body;
  const comment = await taskService.updateComment(taskId, commentId, message, userId);
  res.status(201).json({ success: true, message: 'Comment updated', data: comment });
};

export const deleteComment = async (req, res) => {
  const { taskId, commentId } = req.params;
  const userId = req.user?._id;
  await taskService.deleteComment(taskId, commentId, userId);
  res.status(201).json({ success: true, message: 'Comment deleted' });
};

export const addAttachments = async (req, res) => {
  const { taskId } = req.params;
  const user = req.user;
  const attachments = await taskService.addAttachments(taskId, user, req.files);
  res.status(201).json({ success: true, message: 'Attachments uploaded', data: attachments });
};

export const deleteAttachment = async (req, res) => {
  const { taskId, attachmentId } = req.params;
  const user = req.user;
  await taskService.deleteAttachment(taskId, attachmentId, user);
  res.status(201).json({ success: true, message: 'Attachment deleted' });
};
