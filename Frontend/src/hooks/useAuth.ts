import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/api/authService';
import { useAuthStore } from '@/stores/authStore';
import {
  LoginRequest,
  RegisterRequest,
  OTPRequest,
  ResetPasswordMailRequest,
  ResetPasswordRequest,
  Role,
} from '@/types';
import { ROUTES } from '@/config/constants';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setAuth, clearAuth, user } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (token) => {
      // Decode JWT to get user ID (basic decode, in production use a library)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.sub;
      
      // Fetch user details
      const userData = await authService.getUser(userId);
      
      setAuth(
        {
          id: userData.id,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          role: userData.role,
          isVerified: userData.isVerified,
        },
        token
      );

      toast.success('Login successful!');
      
      // Navigate based on role
      const dashboard = getRoleBasedDashboard(userData.role);
      navigate(dashboard);
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Login failed. Please try again.');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (userId) => {
      toast.success('Registration successful! Please verify your OTP.');
      navigate(ROUTES.VERIFY_OTP, { state: { userId } });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Registration failed. Please try again.');
    },
  });

  // Verify OTP mutation
  const verifyOTPMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: OTPRequest }) =>
      authService.verifyOTP(userId, data),
    onSuccess: () => {
      toast.success('OTP verified successfully! Please login.');
      navigate(ROUTES.LOGIN);
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'OTP verification failed.');
    },
  });

  // Send OTP mutation
  const sendOTPMutation = useMutation({
    mutationFn: authService.sendOTP,
    onSuccess: () => {
      toast.success('OTP sent successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to send OTP.');
    },
  });

  // Reset password mail mutation
  const resetPasswordMailMutation = useMutation({
    mutationFn: authService.resetPasswordMail,
    onSuccess: () => {
      toast.success('Reset password link sent to your email!');
      navigate(ROUTES.RESET_PASSWORD);
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to send reset link.');
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successful! Please login.');
      navigate(ROUTES.LOGIN);
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Password reset failed.');
    },
  });

  // Logout function
  const logout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate(ROUTES.LOGIN);
  };

  return {
    loginMutation,
    registerMutation,
    verifyOTPMutation,
    sendOTPMutation,
    resetPasswordMailMutation,
    resetPasswordMutation,
    logout,
    user,
  };
};

const getRoleBasedDashboard = (role: Role): string => {
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
