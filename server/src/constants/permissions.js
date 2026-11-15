export const PERMISSIONS = {
  TASK: {
    MODULE: 'Task Management',

    CREATE: {
      name: 'task:create',
      description: 'Can create tasks',
    },

    UPDATE: {
      name: 'task:update',
      description: 'Can update tasks',
    },

    DELETE: {
      name: 'task:delete',
      description: 'Can delete tasks',
    },

    ASSIGN: {
      name: 'task:assign',
      description: 'Can assign tasks',
    },

    COMMENT: {
      name: 'task:comment',
      description: 'Can comment on tasks',
    },

    ATTACHMENT: {
      name: 'task:attachment',
      description: 'Can manage task attachments',
    },
    VIEW_ALL: {
      name: 'task:view_all',
      description: 'Can view all tasks',
    },
  },

  USER: {
    MODULE: 'User Management',

    CREATE: {
      name: 'user:create',
      description: 'Can create users',
    },

    UPDATE: {
      name: 'user:update',
      description: 'Can update users',
    },

    DELETE: {
      name: 'user:delete',
      description: 'Can delete users',
    },

    VIEW: {
      name: 'user:view',
      description: 'Can view users',
    },
  },

  REPORT: {
    MODULE: 'Reports',

    VIEW: {
      name: 'report:view',
      description: 'Can view reports',
    },

    EXPORT: {
      name: 'report:export',
      description: 'Can export reports',
    },
  },
};
