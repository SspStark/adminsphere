import { getIO } from './socketServer.js';

const getSocket = () => getIO();

export const socketEmitter = {
  emitToUser(userId, event, data) {
    getSocket().to(`user:${userId}`).emit(event, data);
  },

  emitToUsers(userIds, event, data) {
    const io = getSocket();

    for (const userId of userIds) {
      io.to(`user:${userId}`).emit(event, data);
    }
  },

  emitToAll(event, data) {
    getSocket().emit(event, data);
  },

  emitToRoom(room, event, data) {
    getSocket().to(room).emit(event, data);
  },
};
