import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import * as dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', authMiddleware, dashboardController.getDashboardStats);

export default router;
