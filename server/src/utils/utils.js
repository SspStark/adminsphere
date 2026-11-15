import crypto from 'crypto';

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const mapUserResponse = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
  email: user.email,
  role: user.role?.name || '',
  profileImage: user.profileImage,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  isActive: user.isActive,
  permissions: user.role?.permissions ? user.role.permissions.map((permission) => permission.name) : [],
});
