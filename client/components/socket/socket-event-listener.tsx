'use client';

import { useSocketEvents } from '@/hooks/use-socket-events';

export default function SocketEventListener() {
  useSocketEvents();

  return null;
}
