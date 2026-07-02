import api from '@/shared/api/axios';
import { 
  LoginRequest, 
  RegisterRequest, 
  ResetPasswordMailRequest, 
  ResetPasswordRequest, 
  OTPRequest 
} from '@/shared/types/models';

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await api.post('/api/auth/login', data);
    return response.data; // Assumes backend returns { token, user }
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  sendOtp: async (userId: string) => {
    const response = await api.put(`/api/auth/${userId}/sendOTP`);
    return response.data;
  },

  verifyOtp: async (userId: string, data: OTPRequest) => {
    const response = await api.put(`/api/auth/${userId}/verifyOTP`, data);
    return response.data;
  },

  forgotPassword: async (data: ResetPasswordMailRequest) => {
    const response = await api.post('/api/auth/ResetPasswordMail', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await api.put('/api/auth/ResetPassword', data);
    return response.data;
  },
  
  getUser: async (userId: string) => {
    const response = await api.get(`/api/auth/${userId}/get-user`);
    return response.data;
  }
};
