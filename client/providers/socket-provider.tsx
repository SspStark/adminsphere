'use client';

import { socket } from '@/lib/socket';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';

type SocketProviderProps = {
  children: React.ReactNode;
};

export default function SocketProvider({ children }: SocketProviderProps) {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      if (socket.connected) {
        socket.disconnect();
      }

      return;
    }

    const handleConnect = () => {
      console.log('Socket connected:', socket.id);
    };

    const handleDisconnect = (reason: string) => {
      console.log('Socket disconnected:', reason);
    };

    const handleConnectError = (error: Error) => {
      console.error('Socket connection error:', error.message);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, [user]);

  return children;
}
