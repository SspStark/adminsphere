import { PERMISSIONS } from './permissions.js';

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee',
};

export const SYSTEM_ROLES = {
  SUPER_ADMIN: {
    name: ROLES.SUPER_ADMIN,
    description: 'Full system access',
    permissions: 'ALL',
  },

  ADMIN: {
    name: ROLES.ADMIN,
    description: 'Administrative access',
    permissions: [
      PERMISSIONS.TASK.CREATE.name,
      PERMISSIONS.TASK.UPDATE.name,
      PERMISSIONS.TASK.DELETE.name,
      PERMISSIONS.TASK.ASSIGN.name,
      PERMISSIONS.TASK.COMMENT.name,
      PERMISSIONS.TASK.ATTACHMENT.name,
      PERMISSIONS.TASK.VIEW_ALL.name,

      PERMISSIONS.USER.CREATE.name,
      PERMISSIONS.USER.UPDATE.name,
      PERMISSIONS.USER.DELETE.name,
      PERMISSIONS.USER.VIEW.name,

      PERMISSIONS.REPORT.VIEW.name,
      PERMISSIONS.REPORT.EXPORT.name,
    ],
  },

  EMPLOYEE: {
    name: ROLES.EMPLOYEE,
    description: 'Standard employee access',
    permissions: [PERMISSIONS.TASK.UPDATE.name, PERMISSIONS.TASK.COMMENT.name, PERMISSIONS.TASK.ATTACHMENT.name],
  },
};
