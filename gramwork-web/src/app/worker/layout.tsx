import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { RoleGuard } from '@/shared/components/guards/RoleGuard';

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["Worker"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </RoleGuard>
  );
}
