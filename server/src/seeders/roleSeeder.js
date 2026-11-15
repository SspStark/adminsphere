import Role from '../models/Role.js';
import Permission from '../models/Permission.js';
import { SYSTEM_ROLES } from '../constants/roles.js';
import logger from '../config/logger.js';

export const seedRoles = async () => {
  try {
    const permissions = await Permission.find().lean();

    const permissionMap = new Map(permissions.map((permission) => [permission.name, permission._id]));

    const operations = [];

    for (const role of Object.values(SYSTEM_ROLES)) {
      let permissionIds = [];

      if (role.permissions === 'ALL') {
        permissionIds = permissions.map((permission) => permission._id);
      } else {
        permissionIds = role.permissions.map((permissionName) => {
          const permissionId = permissionMap.get(permissionName);

          if (!permissionId) {
            throw new Error(`Permission "${permissionName}" not found.`);
          }

          return permissionId;
        });
      }

      operations.push({
        updateOne: {
          filter: { name: role.name },
          update: {
            $set: {
              name: role.name,
              description: role.description,
              permissions: permissionIds,
              isSystem: true,
            },
          },
          upsert: true,
        },
      });
    }

    await Role.bulkWrite(operations);
    logger.info('Roles seeded successfully');
  } catch (error) {
    logger.error('Role seeder error:', error);
  }
};
