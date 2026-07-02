import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { RoleGuard } from '@/shared/components/guards/RoleGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["Admin"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </RoleGuard>
  );
}
