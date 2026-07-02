'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/shared/utils/utils';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { LayoutDashboard, Briefcase, CheckSquare, Clock, CreditCard, Users, Settings } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  const role = user.role.toLowerCase(); 
  
  const navItems = {
    employer: [
      { name: 'Dashboard', href: '/employer', icon: LayoutDashboard },
      { name: 'Jobs', href: '/employer/jobs', icon: Briefcase },
      { name: 'Assignments', href: '/employer/assignments', icon: CheckSquare },
      { name: 'Attendance', href: '/employer/attendance', icon: Clock },
      { name: 'Payments', href: '/employer/payments', icon: CreditCard },
      { name: 'Profile', href: '/employer/profile', icon: Settings },
    ],
    worker: [
      { name: 'Dashboard', href: '/worker', icon: LayoutDashboard },
      { name: 'Available Jobs', href: '/worker/jobs', icon: Briefcase },
      { name: 'My Assignments', href: '/worker/assignments', icon: CheckSquare },
      { name: 'My Attendance', href: '/worker/attendance', icon: Clock },
      { name: 'Profile', href: '/worker/profile', icon: Settings },
    ],
    admin: [
      { name: 'Analytics', href: '/admin', icon: LayoutDashboard },
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'System Jobs', href: '/admin/jobs', icon: Briefcase },
    ]
  };

  const currentNav = navItems[role as keyof typeof navItems] || [];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background hidden md:flex">
      <div className="flex h-14 items-center border-b px-6">
        <span className="font-bold tracking-tight text-primary">GramWork</span>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          {currentNav.map((item) => {
            const Icon = item.icon;
            // Exact match for dashboard root, partial match for sub-routes
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== `/${role}`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted",
                  isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  );
}
