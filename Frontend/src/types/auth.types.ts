import { Role } from './enums';

// Auth Models
export interface Auth {
  id: string;
  email: string;
  phoneNumber: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  registerDate: string;
  updateDate: string;
}

// Request DTOs
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OTPRequest {
  otp: string;
}

export interface ResetPasswordMailRequest {
  email: string;
}

export interface ResetPasswordRequest {
  otp: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Response DTOs
export interface AuthResponse {
  token: string;
  userId: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
}
