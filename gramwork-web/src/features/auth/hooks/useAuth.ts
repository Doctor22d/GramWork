import { useAuthStore } from '../store/useAuthStore';
import { 
  useLoginMutation, 
  useRegisterMutation, 
  useForgotPasswordMutation, 
  useResetPasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation 
} from '../mutations/useAuthMutations';

export const useAuth = () => {
  const store = useAuthStore();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const sendOtpMutation = useSendOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  return {
    ...store,
    // Mutations
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    
    forgotPassword: forgotPasswordMutation.mutate,
    isSendingResetMail: forgotPasswordMutation.isPending,
    
    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,

    sendOtp: sendOtpMutation.mutate,
    isSendingOtp: sendOtpMutation.isPending,

    verifyOtp: verifyOtpMutation.mutate,
    isVerifyingOtp: verifyOtpMutation.isPending,
  };
};
