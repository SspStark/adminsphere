import RouteGuard from '@/components/auth/route-guard';
import Navbar from '@/components/dashboard/navbar';
import Sidebar from '@/components/dashboard/sidebar';
import SocketEventListener from '@/components/socket/socket-event-listener';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function dashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <RouteGuard mode="auth">
      <SocketEventListener />

      <main className="min-h-screen flex">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <section className="p-6">{children}</section>
        </div>
      </main>
    </RouteGuard>
  );
}
