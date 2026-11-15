import * as dashboardService from '../services/dashboardService.js';

export const getDashboardStats = async (req, res) => {
  const stats = await dashboardService.getDashboardStats(req.user);

  res.status(200).json({ success: true, data: stats });
};
