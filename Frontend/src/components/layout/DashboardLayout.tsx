import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Role } from '@/types';
import { ROUTES } from '@/config/constants';
import { 
  LogOut, 
  User, 
  Briefcase, 
  ClipboardList, 
  Calendar, 
  Wallet,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { unreadCount } = useNotificationStore();

  const getNavigationItems = () => {
    if (user?.role === Role.Worker) {
      return [
        { name: 'Dashboard', path: ROUTES.WORKER.DASHBOARD, icon: Briefcase },
        { name: 'Profile', path: ROUTES.WORKER.PROFILE, icon: User },
        { name: 'Find Jobs', path: ROUTES.WORKER.JOBS, icon: Briefcase },
        { name: 'Assignments', path: ROUTES.WORKER.ASSIGNMENTS, icon: ClipboardList },
        { name: 'Attendance', path: ROUTES.WORKER.ATTENDANCE, icon: Calendar },
        { name: 'Payments', path: ROUTES.WORKER.PAYMENTS, icon: Wallet },
      ];
    } else if (user?.role === Role.Employer) {
      return [
        { name: 'Dashboard', path: ROUTES.EMPLOYER.DASHBOARD, icon: Briefcase },
        { name: 'Profile', path: ROUTES.EMPLOYER.PROFILE, icon: User },
        { name: 'Jobs', path: ROUTES.EMPLOYER.JOBS, icon: Briefcase },
        { name: 'Workers', path: ROUTES.EMPLOYER.WORKERS, icon: User },
        { name: 'Assignments', path: ROUTES.EMPLOYER.ASSIGNMENTS, icon: ClipboardList },
        { name: 'Attendance', path: ROUTES.EMPLOYER.ATTENDANCE, icon: Calendar },
        { name: 'Payments', path: ROUTES.EMPLOYER.PAYMENTS, icon: Wallet },
      ];
    } else if (user?.role === Role.Admin) {
      return [
        { name: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD, icon: Briefcase },
        { name: 'Users', path: ROUTES.ADMIN.USERS, icon: User },
        { name: 'Jobs', path: ROUTES.ADMIN.JOBS, icon: Briefcase },
        { name: 'Payments', path: ROUTES.ADMIN.PAYMENTS, icon: Wallet },
        { name: 'Analytics', path: ROUTES.ADMIN.ANALYTICS, icon: ClipboardList },
      ];
    }
    return [];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <h1 className="text-xl font-bold text-primary">GramWork</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-card transition-transform lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="space-y-1 p-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
