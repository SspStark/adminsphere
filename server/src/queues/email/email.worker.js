import { Worker } from 'bullmq';
import { bullMQConnection } from '../config/bullmqConnection.js';
import logger from '../../config/logger.js';

import { sendWelcomeEmail } from '../../integrations/mailService.js';
import logWorkerError from '../../utils/logWorkerError.js';

export const emailWorker = new Worker(
  'email',
  async (job) => {
    logger.info(`Processing email job: ${job.id}`, {
      jobName: job.name,
    });

    switch (job.name) {
      case 'send-welcome-email':
        await sendWelcomeEmail(job.data);
        break;

      default:
        throw new Error(`Unknown email job: ${job.name}`);
    }
  },
  {
    connection: bullMQConnection,
    concurrency: 5,
  }
);

emailWorker.on('completed', (job) => {
  logger.info(`Email job completed: ${job.id}`, {
    jobName: job.name,
  });
});

emailWorker.on('failed', (job, error) => {
  logger.error('Email job failed', {
    jobId: job?.id,
    jobName: job?.name,
    attemptsMade: job?.attemptsMade,
    error: error.message,
  });

  if (job && job.attemptsMade >= job.opts.attempts) {
    logger.error('Email job permanently failed after all retries', {
      jobId: job.id,
      jobName: job.name,
    });
  }
});

emailWorker.on('error', (error) => {
  logWorkerError(logger, 'Email', error);
});

logger.info('Email worker started...');
