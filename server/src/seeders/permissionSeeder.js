// Seeder -> seeder is simply a script that inserts initial application data to database.
// seeder must be idempotent.
// Idempotent -> Running it once or ten times produces the same final result.

import Permission from '../models/Permission.js';
import { PERMISSIONS } from '../constants/permissions.js';
import logger from '../config/logger.js';

export const seedPermissions = async () => {
  try {
    const permissionDocuments = [];

    for (const modulePermissions of Object.values(PERMISSIONS)) {
      const { MODULE, ...permissions } = modulePermissions;

      for (const permission of Object.values(permissions)) {
        const [resource, action] = permission.name.split(':');

        permissionDocuments.push({
          name: permission.name,
          resource,
          action,
          module: MODULE,
          description: permission.description,
        });
      }
    }

    const operations = permissionDocuments.map((permission) => ({
      updateOne: {
        filter: { name: permission.name },
        update: { $set: permission },
        upsert: true,
      },
    }));

    await Permission.bulkWrite(operations);
    logger.info('Permissions seeded successfully');
  } catch (error) {
    logger.error('Permission seeder error:', error);
  }
};
