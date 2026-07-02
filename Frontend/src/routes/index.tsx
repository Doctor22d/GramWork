import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Role } from '@/types';
import { ROUTES } from '@/config/constants';
import ProtectedRoute from './ProtectedRoute';

// Lazy load pages for better performance
import { lazy, Suspense } from 'react';

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const VerifyOTPPage = lazy(() => import('@/pages/auth/VerifyOTPPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// Worker pages
const WorkerDashboard = lazy(() => import('@/pages/worker/WorkerDashboard'));
const WorkerProfile = lazy(() => import('@/pages/worker/WorkerProfile'));
const WorkerJobs = lazy(() => import('@/pages/worker/WorkerJobs'));
const WorkerAssignments = lazy(() => import('@/pages/worker/WorkerAssignments'));
const WorkerAttendance = lazy(() => import('@/pages/worker/WorkerAttendance'));
const WorkerPayments = lazy(() => import('@/pages/worker/WorkerPayments'));

// Employer pages
const EmployerDashboard = lazy(() => import('@/pages/employer/EmployerDashboard'));
const EmployerProfile = lazy(() => import('@/pages/employer/EmployerProfile'));
const EmployerJobs = lazy(() => import('@/pages/employer/EmployerJobs'));
const CreateJob = lazy(() => import('@/pages/employer/CreateJob'));
const JobDetail = lazy(() => import('@/pages/employer/JobDetail'));
const EmployerWorkers = lazy(() => import('@/pages/employer/EmployerWorkers'));
const EmployerAssignments = lazy(() => import('@/pages/employer/EmployerAssignments'));
const EmployerAttendance = lazy(() => import('@/pages/employer/EmployerAttendance'));
const EmployerPayments = lazy(() => import('@/pages/employer/EmployerPayments'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminJobs = lazy(() => import('@/pages/admin/AdminJobs'));
const AdminPayments = lazy(() => import('@/pages/admin/AdminPayments'));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route
          path={ROUTES.HOME}
          element={
            isAuthenticated ? (
              <Navigate to={getRoleBasedDashboard(user?.role)} replace />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />
        <Route
          path={ROUTES.LOGIN}
          element={isAuthenticated ? <Navigate to={getRoleBasedDashboard(user?.role)} replace /> : <LoginPage />}
        />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.VERIFY_OTP} element={<VerifyOTPPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

        {/* Worker routes */}
        <Route
          path={ROUTES.WORKER.DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[Role.Worker]}>
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.WORKER.PROFILE}
          element={
            <ProtectedRoute allowedRoles={[Role.Worker]}>
              <WorkerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.WORKER.JOBS}
          element={
            <ProtectedRoute allowedRoles={[Role.Worker]}>
              <WorkerJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.WORKER.ASSIGNMENTS}
          element={
            <ProtectedRoute allowedRoles={[Role.Worker]}>
              <WorkerAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.WORKER.ATTENDANCE}
          element={
            <ProtectedRoute allowedRoles={[Role.Worker]}>
              <WorkerAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.WORKER.PAYMENTS}
          element={
            <ProtectedRoute allowedRoles={[Role.Worker]}>
              <WorkerPayments />
            </ProtectedRoute>
          }
        />

        {/* Employer routes */}
        <Route
          path={ROUTES.EMPLOYER.DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[Role.Employer]}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.EMPLOYER.PROFILE}
          element={
            <ProtectedRoute allowedRoles={[Role.Employer]}>
              <EmployerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.EMPLOYER.JOBS}
          element={
            <ProtectedRoute allowedRoles={[Role.Employer]}>
              <EmployerJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.EMPLOYER.CREATE_JOB}
          element={
            <ProtectedRoute allowedRoles={[Role.Employer]}>
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.EMPLOYER.JOB_DETAIL}
          element={
            <ProtectedRoute allowedRoles={[Role.Employer]}>
              <JobDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.EMPLOYER.WORKERS}
          element={
            <ProtectedRoute allowedRoles={[Role.Employer]}>
              <EmployerWorkers />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.EMPLOYER.ASSIGNMENTS}
          element={
            <ProtectedRoute allowedRoles={[Role.Employer]}>
              <EmployerAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.EMPLOYER.ATTENDANCE}
          element={
            <ProtectedRoute allowedRoles={[Role.Employer]}>
              <EmployerAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.EMPLOYER.PAYMENTS}
          element={
            <ProtectedRoute allowedRoles={[Role.Employer]}>
              <EmployerPayments />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path={ROUTES.ADMIN.DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[Role.Admin]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN.USERS}
          element={
            <ProtectedRoute allowedRoles={[Role.Admin]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN.JOBS}
          element={
            <ProtectedRoute allowedRoles={[Role.Admin]}>
              <AdminJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN.PAYMENTS}
          element={
            <ProtectedRoute allowedRoles={[Role.Admin]}>
              <AdminPayments />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN.ANALYTICS}
          element={
            <ProtectedRoute allowedRoles={[Role.Admin]}>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  );
};

const getRoleBasedDashboard = (role?: Role): string => {
  switch (role) {
    case Role.Worker:
      return ROUTES.WORKER.DASHBOARD;
    case Role.Employer:
      return ROUTES.EMPLOYER.DASHBOARD;
    case Role.Admin:
      return ROUTES.ADMIN.DASHBOARD;
    default:
      return ROUTES.LOGIN;
  }
};

export default AppRoutes;
