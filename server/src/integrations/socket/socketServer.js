import { Server } from 'socket.io';
import cookie from 'cookie';
import logger from '../../config/logger.js';
import { verifyAccessToken } from '../../services/jwtService.js';
import { hasPermission } from '../../policies/commonPolicy.js';
import { PERMISSIONS } from '../../constants/permissions.js';

let IO;

const allowedOrigins = process.env.ALLOWED_CLIENT_URLS?.split(',').map((url) => url.trim()) ?? [];

export function initSocket(server) {
  IO = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  IO.use(async (socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;
      if (!rawCookie) return next(new Error('Authentication required'));

      const cookies = cookie.parse(rawCookie);
      const accessToken = cookies.accessToken;

      if (!accessToken) return next(new Error('No token'));

      const decoded = verifyAccessToken(accessToken);

      const { id, sessionId, role, permissions } = decoded;

      socket.user = {
        _id: id,
        role,
        permissions,
        sessionId,
      };

      next(); // allow connection
    } catch (error) {
      logger.error('Socket authentication failed:', error);

      next(new Error('Unauthorized'));
    }
  });

  IO.on('connection', (socket) => {
    const userId = socket.user._id;

    // auto join user room
    socket.join(`user:${userId}`);

    if (hasPermission(socket.user, PERMISSIONS.TASK.VIEW_ALL)) {
      socket.join('dashboard');
    }

    logger.info(`Socket connected for user ${userId}`);

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected for user ${userId}: ${reason}`);
    });
  });
}

export function getIO() {
  if (!IO) throw new Error('Socket.io not initialized');
  return IO;
}
