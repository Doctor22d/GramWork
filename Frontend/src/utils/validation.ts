import { z } from 'zod';
import { VALIDATION } from '@/config/constants';
import { Role, Gender, Category, UrgencyLevel, Availability, PaymentMethodEnum } from '@/types';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
      .refine(
        (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(val),
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .refine(
        (val) => /^[6-9]\d{9}$/.test(val),
        'Please enter a valid 10-digit Indian mobile number'
      ),
    role: z.nativeEnum(Role),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const resetPasswordSchema = z
  .object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
      .refine(
        (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(val),
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Worker profile validation schema
export const workerProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(18, 'Must be at least 18 years old').max(100, 'Invalid age'),
  gender: z.nativeEnum(Gender),
  aadhaarNumber: z.string().refine(
    (val) => /^\d{12}$/.test(val),
    'Aadhaar must be 12 digits'
  ),
  village: z.string().min(2, 'Village name is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  skill: z.string().min(2, 'Skill is required'),
  yearsOfExperience: z.number().min(0, 'Experience cannot be negative').max(50),
  dailyWage: z.number().min(0, 'Wage must be positive'),
  workingHours: z.string().min(1, 'Working hours are required'),
  preferredCategories: z.array(z.string()).min(1, 'Select at least one category'),
  languagesKnown: z.array(z.string()).min(1, 'Select at least one language'),
  availability: z.nativeEnum(Availability),
});

// Employer profile validation schema
export const employerProfileSchema = z.object({
  employerName: z.string().min(2, 'Name must be at least 2 characters'),
  employerEmail: z.string().email('Invalid email address'),
  employerPhone: z.string().refine(
    (val) => /^[6-9]\d{9}$/.test(val),
    'Invalid phone number'
  ),
  aadhaarNumber: z.string().refine(
    (val) => /^\d{12}$/.test(val),
    'Aadhaar must be 12 digits'
  ),
});

// Job posting validation schema
export const jobPostingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  category: z.nativeEnum(Category),
  requiredSkills: z.string().optional(),
  requiredWorkers: z.number().min(1, 'At least 1 worker required'),
  wage: z.number().min(0, 'Wage must be positive'),
  duration: z.string().optional(),
  urgencyLevel: z.nativeEnum(UrgencyLevel),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(5, 'Address is required'),
  village: z.string().optional(),
  pincode: z.string().refine(
    (val) => !val || /^\d{6}$/.test(val),
    'Pincode must be 6 digits'
  ).optional(),
  startDate: z.string(),
  deadline: z.string().optional(),
});

// Payment validation schema
export const paymentSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  paymentMethod: z.nativeEnum(PaymentMethodEnum),
  paidBy: z.string().min(1, 'Paid by is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type WorkerProfileFormData = z.infer<typeof workerProfileSchema>;
export type EmployerProfileFormData = z.infer<typeof employerProfileSchema>;
export type JobPostingFormData = z.infer<typeof jobPostingSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
