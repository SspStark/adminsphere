import { LayoutDashboard, CheckSquare, Users, Settings } from 'lucide-react';
import { PERMISSIONS } from './permissions';

export const SIDEBAR_ITEMS = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    permission: PERMISSIONS.USER.VIEW,
  },
  // {
  //   title: 'Settings',
  //   href: '/settings',
  //   icon: Settings,
  // },
];
