import { hasPermission } from '../policies/commonPolicy.js';

export const authorize = (permissionObj) => {
  return (req, res, next) => {
    if (!hasPermission(req.user, permissionObj)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to perform this action.' });
    }

    next();
  };
};
