'use client';

import { useEffect, useRef, useState } from 'react';

import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications } from '@/hooks/use-notifications';

import NotificationItem from './notification-item';

type NotificationCenterProps = {
  onClose: () => void;
};

export default function NotificationCenter({ onClose }: NotificationCenterProps) {
  const [markingId, setMarkingId] = useState<string | null>(null);

  const notificationRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useNotifications();

  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const notifications = data?.data ?? [];

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleMarkAsRead = (id: string) => {
    setMarkingId(id);

    markAsReadMutation.mutate(id, {
      onSettled: () => {
        setMarkingId(null);
      },
    });
  };

  return (
    <div
      ref={notificationRef}
      className="absolute right-0 top-12 z-50 w-100 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/40"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Notifications</h2>

          {unreadCount > 0 && <p className="mt-0.5 text-xs text-gray-500">{unreadCount} unread</p>}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            className="text-xs font-medium text-blue-400 transition hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {markAllAsReadMutation.isPending ? 'Marking...' : 'Mark all as read'}
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex h-48 items-center justify-center">
          <p className="text-sm text-gray-500">Loading notifications...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex h-48 items-center justify-center px-6 text-center">
          <p className="text-sm text-red-400">Failed to load notifications.</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && notifications.length === 0 && (
        <div className="flex h-56 flex-col items-center justify-center px-6 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-lg">🔔</div>

          <p className="text-sm font-medium text-white">You&apos;re all caught up</p>

          <p className="mt-1 text-xs text-gray-500">No new notifications to show.</p>
        </div>
      )}

      {/* Notifications */}
      {!isLoading && !isError && notifications.length > 0 && (
        <div className="max-h-110 overflow-y-auto">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              isMarkingAsRead={markingId === notification._id}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}
