import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  otpSchema,
  workerProfileSchema,
  jobPostingSchema,
} from '../validation';
import { Role, Gender, Category, UrgencyLevel, Availability } from '@/types';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('validates correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('validates correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
        phoneNumber: '9876543210',
        role: Role.Worker,
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
        confirmPassword: 'weak',
        phoneNumber: '9876543210',
        role: Role.Worker,
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects mismatched passwords', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test@1234',
        confirmPassword: 'Different@1234',
        phoneNumber: '9876543210',
        role: Role.Worker,
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects invalid phone number', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
        phoneNumber: '123',
        role: Role.Worker,
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('otpSchema', () => {
    it('validates 6-digit OTP', () => {
      const validData = { otp: '123456' };
      const result = otpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid OTP length', () => {
      const invalidData = { otp: '123' };
      const result = otpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('workerProfileSchema', () => {
    it('validates correct worker profile', () => {
      const validData = {
        name: 'John Doe',
        age: 25,
        gender: Gender.MALE,
        aadhaarNumber: '123456789012',
        village: 'Village Name',
        latitude: 28.6139,
        longitude: 77.209,
        skill: 'Farming',
        yearsOfExperience: 5,
        dailyWage: 500,
        workingHours: '08:00-17:00',
        preferredCategories: ['FARMING'],
        languagesKnown: ['Hindi'],
        availability: Availability.AVAILABLE,
      };
      const result = workerProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects age below 18', () => {
      const invalidData = {
        name: 'John Doe',
        age: 17,
        gender: Gender.MALE,
        aadhaarNumber: '123456789012',
        village: 'Village',
        latitude: 28.6139,
        longitude: 77.209,
        skill: 'Farming',
        yearsOfExperience: 0,
        dailyWage: 500,
        workingHours: '08:00-17:00',
        preferredCategories: ['FARMING'],
        languagesKnown: ['Hindi'],
        availability: Availability.AVAILABLE,
      };
      const result = workerProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('jobPostingSchema', () => {
    it('validates correct job posting', () => {
      const validData = {
        title: 'Farm Work',
        category: Category.FARMING,
        requiredWorkers: 5,
        wage: 700,
        urgencyLevel: UrgencyLevel.HIGH,
        latitude: 28.6139,
        longitude: 77.209,
        address: '123 Main St',
        startDate: '2024-01-20T08:00:00',
      };
      const result = jobPostingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid wage', () => {
      const invalidData = {
        title: 'Farm Work',
        category: Category.FARMING,
        requiredWorkers: 5,
        wage: -100,
        urgencyLevel: UrgencyLevel.HIGH,
        latitude: 28.6139,
        longitude: 77.209,
        address: '123 Main St',
        startDate: '2024-01-20T08:00:00',
      };
      const result = jobPostingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
