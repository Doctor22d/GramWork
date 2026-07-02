import createAxiosInstance from './axiosInstance';
import { API_URLS } from '@/config/constants';
import {
  RegisterRequest,
  LoginRequest,
  OTPRequest,
  ResetPasswordMailRequest,
  ResetPasswordRequest,
  Auth,
} from '@/types';

const authApi = createAxiosInstance(API_URLS.AUTH);

export const authService = {
  // Register new user
  register: async (data: RegisterRequest): Promise<string> => {
    const response = await authApi.post<string>('/api/auth/register', data);
    return response.data;
  },

  // Login
  login: async (data: LoginRequest): Promise<string> => {
    const response = await authApi.post<string>('/api/auth/login', data);
    return response.data; // Returns JWT token
  },

  // Get user by ID
  getUser: async (userId: string): Promise<Auth> => {
    const response = await authApi.get<Auth>(`/api/auth/${userId}/get-user`);
    return response.data;
  },

  // Send OTP
  sendOTP: async (userId: string): Promise<string> => {
    const response = await authApi.put<string>(`/api/auth/${userId}/sendOTP`);
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (userId: string, data: OTPRequest): Promise<string> => {
    const response = await authApi.put<string>(`/api/auth/${userId}/verifyOTP`, data);
    return response.data;
  },

  // Send reset password email
  resetPasswordMail: async (data: ResetPasswordMailRequest): Promise<string> => {
    const response = await authApi.post<string>('/api/auth/ResetPasswordMail', data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<string> => {
    const response = await authApi.put<string>('/api/auth/ResetPassword', data);
    return response.data;
  },
};
