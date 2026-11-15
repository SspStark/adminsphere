import { ROLES } from '../constants/roles.js';

export const isTaskAssignee = (user, task) => {
  return task.assignedTo?.toString() === user._id.toString();
};

export const canManageTask = (user) => {
  return user.role !== ROLES.EMPLOYEE;
};
