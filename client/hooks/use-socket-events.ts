'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { socket } from '@/lib/socket';
import { taskKeys } from '@/lib/react-query/task-keys';
import { dashboardKeys } from '@/lib/react-query/dashboard-keys';
import { notificationKeys } from '@/lib/react-query/notification-keys';

import type { Notification, UnreadCountResponse, GetNotificationsResponse } from '@/types/notification.types';

export function useSocketEvents() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleTaskUpdated = () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.all,
      });
    };

    const handleDashboardUpdate = () => {
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.all,
      });
    };

    const handleNotificationCreated = (payload: { notification: Notification }) => {
      const { notification } = payload;

      // Update unread count
      queryClient.setQueryData(notificationKeys.unreadCount(), (old: UnreadCountResponse | undefined) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            count: old.data.count + 1,
          },
        };
      });

      // Update notification list if it is already cached
      queryClient.setQueryData(notificationKeys.list(1, 20), (old: GetNotificationsResponse | undefined) => {
        if (!old) return old;

        return {
          ...old,
          data: [notification, ...old.data],
          total: old.total + 1,
        };
      });
    };

    socket.on('TASK_UPDATED', handleTaskUpdated);
    socket.on('DASHBOARD_UPDATED', handleDashboardUpdate);
    socket.on('NOTIFICATION_CREATED', handleNotificationCreated);

    return () => {
      socket.off('TASK_UPDATED', handleTaskUpdated);
      socket.off('DASHBOARD_UPDATED', handleDashboardUpdate);
      socket.off('NOTIFICATION_CREATED', handleNotificationCreated);
    };
  }, [queryClient]);
}
