import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createUserValidation, validateResult } from '../middlewares/validation.js';
import uploadAvatar from '../middlewares/uploadAvatar.js';
import { authorize } from '../middlewares/authorize.js';

import * as userController from '../controllers/userController.js';

import * as adminController from '../controllers/adminController.js';
import { downloadUsersPDF } from '../controllers/pdfController.js';
import { downloadUsersExcel } from '../controllers/excelController.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = express.Router();

// Self routes
router.patch('/me', authMiddleware, userController.updateMe);
router.patch('/me/password', authMiddleware, userController.changeMyPassword);
router.patch('/me/avatar', authMiddleware, uploadAvatar.single('avatar'), userController.uploadMyAvatar);
router.delete('/me/avatar', authMiddleware, userController.deleteMyAvatar);

// Admin routes
router.get('/reports/users-pdf', authMiddleware, authorize(PERMISSIONS.REPORT.EXPORT), downloadUsersPDF);
router.get('/reports/users-excel', authMiddleware, authorize(PERMISSIONS.REPORT.EXPORT), downloadUsersExcel);

router.post(
  '/',
  authMiddleware,
  authorize(PERMISSIONS.USER.CREATE),
  createUserValidation,
  validateResult,
  adminController.createUser
);
router.get('/', authMiddleware, authorize(PERMISSIONS.USER.VIEW), adminController.getAllUsers);
router.get('/:id', authMiddleware, authorize(PERMISSIONS.USER.VIEW), adminController.getUserById);
router.patch('/:id', authMiddleware, authorize(PERMISSIONS.USER.UPDATE), adminController.updateUserByAdmin);
router.delete('/:id', authMiddleware, authorize(PERMISSIONS.USER.DELETE), adminController.deleteUserByAdmin);
router.patch(
  '/:id/password',
  authMiddleware,
  authorize(PERMISSIONS.USER.UPDATE),
  adminController.resetUserPasswordByAdmin
);
router.patch(
  '/:id/avatar',
  authMiddleware,
  authorize(PERMISSIONS.USER.UPDATE),
  uploadAvatar.single('avatar'),
  adminController.uploadUserAvatarByAdmin
);
router.delete(
  '/:id/avatar',
  authMiddleware,
  authorize(PERMISSIONS.USER.UPDATE),
  adminController.deleteUserAvatarByAdmin
);

export default router;
