import 'dotenv/config';

import connectDB from './src/config/db.js';
import logger from './src/config/logger.js';

import { emailWorker } from './src/queues/email/email.worker.js';
import { reportsWorker } from './src/queues/reports/reports.worker.js';

const startWorker = async () => {
  try {
    await connectDB();

    logger.info('Background worker process started');
  } catch (error) {
    logger.error('Worker startup failed:', error);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  logger.info(`Worker shutdown requested: ${signal}`);

  try {
    await Promise.all([emailWorker.close(), reportsWorker.close()]);

    logger.info('All workers closed');

    process.exit(0);
  } catch (error) {
    logger.error('Worker shutdown failed', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startWorker();
