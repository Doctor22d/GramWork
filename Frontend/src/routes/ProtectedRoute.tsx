import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Role } from '@/types';
import { ROUTES } from '@/config/constants';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and save the attempted location
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User doesn't have permission, redirect to their dashboard
    const dashboardRoute = getDashboardRoute(user.role);
    return <Navigate to={dashboardRoute} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const getDashboardRoute = (role: Role): string => {
  switch (role) {
    case Role.Worker:
      return ROUTES.WORKER.DASHBOARD;
    case Role.Employer:
      return ROUTES.EMPLOYER.DASHBOARD;
    case Role.Admin:
      return ROUTES.ADMIN.DASHBOARD;
    default:
      return ROUTES.HOME;
  }
};

export default ProtectedRoute;
