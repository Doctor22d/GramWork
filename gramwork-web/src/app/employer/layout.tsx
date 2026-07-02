import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { RoleGuard } from '@/shared/components/guards/RoleGuard';

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["Employer"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </RoleGuard>
  );
}
