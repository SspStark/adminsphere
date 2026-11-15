'use client';

import { useRouter } from 'next/navigation';
import { Notification } from '@/types/notification.types';

type NotificationItemProps = {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  isMarkingAsRead: boolean;
  onClose: () => void;
};

function formatNotificationTime(date: string) {
  const notificationDate = new Date(date);
  const now = new Date();

  const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return notificationDate.toLocaleDateString();
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  isMarkingAsRead,
  onClose,
}: NotificationItemProps) {
  const router = useRouter();

  const actorName = notification.actor ? `${notification.actor.firstName} ${notification.actor.lastName}` : null;

  const hasTask = Boolean(notification.task);

  const handleNotificationClick = () => {
    if (!notification.task) {
      return;
    }

    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }

    onClose();

    router.push(`/tasks/${notification.task._id}`);
  };

  return (
    <div
      onClick={hasTask ? handleNotificationClick : undefined}
      className={`border-b border-white/5 px-4 py-4 transition-colors ${
        hasTask ? 'cursor-pointer hover:bg-white/4' : ''
      } ${notification.isRead ? '' : 'bg-white/2.5'}`}
    >
      <div className="flex gap-3">
        {/* Unread indicator */}
        <div className="pt-1.5">
          <span className={`block h-2 w-2 rounded-full ${notification.isRead ? 'bg-transparent' : 'bg-blue-400'}`} />
        </div>

        <div className="min-w-0 flex-1">
          {/* Title */}
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`text-sm leading-5 ${
                notification.isRead ? 'font-medium text-gray-300' : 'font-semibold text-white'
              }`}
            >
              {notification.title}
            </h3>

            <span className="shrink-0 text-[11px] text-gray-500">{formatNotificationTime(notification.createdAt)}</span>
          </div>

          {/* Actor */}
          {actorName && (
            <p className="mt-1 text-xs text-gray-500">
              From <span className="text-gray-400">{actorName}</span>
            </p>
          )}

          {/* Message */}
          <p className="mt-1 text-sm leading-5 text-gray-400">{notification.message}</p>

          {/* Task */}
          {notification.task && (
            <div className="mt-2 rounded-md border border-white/5 bg-white/3 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">Task</p>

              <p className="mt-0.5 truncate text-xs font-medium text-gray-300">{notification.task.title}</p>
            </div>
          )}

          {/* Mark as read */}
          {!notification.isRead && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onMarkAsRead(notification._id);
              }}
              disabled={isMarkingAsRead}
              className="mt-2 text-xs font-medium text-blue-400 transition hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMarkingAsRead ? 'Marking...' : 'Mark as read'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
