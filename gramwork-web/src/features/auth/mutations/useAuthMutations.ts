import { useMutation } from '@tanstack/react-query';
import { authService } from '../api/authService';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useLoginMutation = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Data expected to contain { token, user }
      if (data?.token && data?.user) {
        localStorage.setItem('token', data.token);
        setAuth(data.user, data.token);
        toast.success('Successfully logged in');
        
        // Redirect by role
        const roleStr = String(data.user.role).toLowerCase();
        router.push(`/${roleStr}`);
      } else {
        toast.error('Invalid response from server');
      }
    },
    onError: (error: any) => {
      // Interceptors handle toast, but we can handle specific forms here if needed
    }
  });
};

export const useRegisterMutation = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success('Registration successful. Please log in.');
      router.push('/login');
    }
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast.success('Reset link/OTP sent to your email.');
    }
  });
};

export const useResetPasswordMutation = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success('Password has been reset successfully.');
      router.push('/login');
    }
  });
};

export const useSendOtpMutation = () => {
  return useMutation({
    mutationFn: authService.sendOtp,
    onSuccess: () => {
      toast.success('OTP sent successfully');
    }
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: { otp: string } }) => 
      authService.verifyOtp(userId, data),
    onSuccess: () => {
      toast.success('OTP verified successfully');
    }
  });
};
