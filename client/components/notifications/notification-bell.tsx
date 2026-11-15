'use client';

import { useState } from 'react';
import { useUnreadNotificationCount } from '@/hooks/use-notifications';
import NotificationCenter from './notification-center';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useUnreadNotificationCount();

  const count = data?.data.count ?? 0;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Notifications${count > 0 ? `, ${count} unread` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative ml-5 flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition hover:bg-white/10 hover:text-white"
      >
        <span className="text-xl">🔔</span>

        {!isLoading && count > 0 && (
          <span className="absolute right-0 top-0 flex min-h-5 min-w-5 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && <NotificationCenter onClose={() => setOpen(false)} />}
    </div>
  );
}
