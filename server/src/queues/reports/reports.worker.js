import { Worker } from 'bullmq';

import { bullMQConnection } from '../config/bullmqConnection.js';

import User from '../../models/User.js';

import { renderUsersReportHTML } from '../../integrations/pdf/pdfTemplateService.js';
import { generatePDFBuffer } from '../../integrations/pdf/pdfService.js';
import { sendEmailWithAttachment } from '../../integrations/mailService.js';
import { populateRolePermissions } from '../../services/roleService.js';

import logger from '../../config/logger.js';
import logWorkerError from '../../utils/logWorkerError.js';

export const reportsWorker = new Worker(
  'reports',
  async (job) => {
    logger.info(`Processing report job: ${job.id}`, {
      jobName: job.name,
    });

    switch (job.name) {
      case 'daily-users-report': {
        await job.updateProgress(10);

        const users = await User.find()
          .select('-password')
          .sort({ createdAt: -1 })
          .populate(populateRolePermissions)
          .lean();

        await job.updateProgress(30);

        const html = await renderUsersReportHTML(users);

        await job.updateProgress(50);

        const pdfBuffer = await generatePDFBuffer(html);

        await job.updateProgress(75);

        await sendEmailWithAttachment({
          to: ['ssptonystark@gmail.com'],
          subject: 'Daily Users Report - AdminSphere',
          html: `
            <p>Hello Admin,</p>
            <p>Please find attached the daily users report.</p>
            <p>— AdminSphere</p>
          `,
          attachments: [
            {
              filename: 'users-report.pdf',
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ],
        });

        await job.updateProgress(100);

        break;
      }

      default:
        throw new Error(`Unknown report job: ${job.name}`);
    }
  },
  {
    connection: bullMQConnection,
    concurrency: 1,
  }
);

reportsWorker.on('completed', (job) => {
  logger.info(`Report job completed: ${job.id}`, {
    jobName: job.name,
  });
});

reportsWorker.on('failed', (job, error) => {
  logger.error('Report job failed', {
    jobId: job?.id,
    jobName: job?.name,
    attemptsMade: job?.attemptsMade,
    error: error.message,
  });

  if (job && job.attemptsMade >= job.opts.attempts) {
    logger.error('Reports job permanently failed after all retries', {
      jobId: job.id,
      jobName: job.name,
    });
  }
});

reportsWorker.on('error', (error) => {
  logWorkerError(logger, 'Reports', error);
});

logger.info('Reports worker started...');
