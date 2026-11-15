import { Queue } from 'bullmq';

import { bullMQConnection } from '../config/bullmqConnection.js';

export const reportsQueue = new Queue('reports', {
  connection: bullMQConnection,
  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: 'exponential',
      delay: 5000,
    },

    removeOnComplete: 10,
    removeOnFail: 50,
  },
});
