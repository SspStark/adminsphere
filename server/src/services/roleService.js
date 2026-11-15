import Role from '../models/Role.js';

export const findRoleByName = async (name) => {
  const role = await Role.findOne({ name });

  if (!role) {
    throw new Error(`Role "${name}" not found`);
  }

  return role;
};

export const populateRolePermissions = {
  path: 'role',
  select: 'name permissions',
  populate: {
    path: 'permissions',
    select: 'name',
  },
};
