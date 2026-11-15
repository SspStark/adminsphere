export const hasPermission = (user, permissionObj) => {
  const permissions = user.permissions;
  const requiredPermission = permissionObj.name;

  if (permissions) {
    return permissions.includes(requiredPermission);
  }

  return false;
};
