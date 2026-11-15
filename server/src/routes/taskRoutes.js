import express from 'express';
import * as taskController from '../controllers/taskController.js';
import uploadTaskFiles from '../middlewares/uploadTaskFiles.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorize.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = express.Router();

router.post('/:taskId/comments', authMiddleware, taskController.addComment);
router.patch('/:taskId/comments/:commentId', authMiddleware, taskController.updateComment);
router.delete('/:taskId/comments/:commentId', authMiddleware, taskController.deleteComment);

router.post(
  '/:taskId/attachments',
  authMiddleware,
  uploadTaskFiles.array('attachments', 5),
  taskController.addAttachments
);
router.delete('/:taskId/attachments/:attachmentId', authMiddleware, taskController.deleteAttachment);

router.post(
  '/',
  authMiddleware,
  authorize(PERMISSIONS.TASK.CREATE),
  uploadTaskFiles.array('attachments', 5),
  taskController.createTask
);
router.get('/', authMiddleware, taskController.getTasks);
router.patch('/:id', authMiddleware, taskController.updateTask);
router.delete('/:id', authMiddleware, authorize(PERMISSIONS.TASK.DELETE), taskController.deleteTask);
router.get('/:id', authMiddleware, taskController.getTaskById);

export default router;
