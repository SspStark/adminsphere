import RouteGuard from '@/components/auth/route-guard';
import { PERMISSIONS } from '@/constants/permissions';

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard permission={PERMISSIONS.USER.VIEW}>{children}</RouteGuard>;
}
