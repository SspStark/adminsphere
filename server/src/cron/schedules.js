import cron from 'node-cron';
import logger from '../config/logger.js';

import { reportsQueue } from '../queues/reports/reports.queue.js';

export const registerCronSchedules = () => {
  logger.info('Registering cron schedules...');

  // Daily at 8 PM
  cron.schedule(
    '0 20 * * *',
    async () => {
      await reportsQueue.add('daily-users-report', {});

      logger.info('Daily users report job queued');
    },
    {
      timezone: 'Asia/Kolkata',
    }
  );
};
