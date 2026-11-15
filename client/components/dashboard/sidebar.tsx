'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { SIDEBAR_ITEMS } from '@/constants/sidebar';
import { useAuthStore } from '@/store/auth.store';

export default function Sidebar() {
  const pathname = usePathname();
  const currentUser = useAuthStore((state) => state.user);

  const visibleItems = SIDEBAR_ITEMS.filter(
    (item) => !item.permission || currentUser?.permissions.includes(item.permission)
  );

  return (
    <aside className="w-64 border-r border-white/10 p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">AdminSphere</h2>
      </div>

      <nav className="space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                isActive ? 'bg-white text-black' : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon size={18} />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
