import logger from '../config/logger.js';
import { verifyAccessToken } from '../services/jwtService.js';
import { getSession } from '../services/sessionService.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) return res.status(401).json({ success: false, message: 'Authentication required' });

    const decoded = verifyAccessToken(accessToken);
    const { id, sessionId, role, permissions } = decoded;

    const session = await getSession(sessionId);
    if (!session) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(401).json({ success: false, message: 'Session expired, please login again' });
    }

    req.user = {
      _id: id,
      role: role,
      permissions: permissions,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token',
      });
    }

    logger.error('Auth middleware failed', error);

    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};
