import { Role, Gender, Availability } from './enums';

// Location types
export interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface LocationUpdateRequest {
  longitude: number;
  latitude: number;
}

// Worker Profile
export interface WorkerProfile {
  userId: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email?: string;
  aadhaarNumber: string;
  aadhaarVerified: boolean;
  village: string;
  location: GeoJsonPoint;
  skill: string;
  yearsOfExperience: number;
  dailyWage: number;
  availability: Availability;
  workingHours: string;
  role: Role;
  preferredCategories: string[];
  languagesKnown: string[];
  rating: number;
  reviews: number;
  totalJobsCompleted: number;
  reliabilityScore: number;
}

export interface RequestWorker {
  userID: string;
  age: number;
  name: string;
  gender: Gender;
  aadhaarNumber: string;
  aadhaarVerified: boolean;
  village: string;
  latitude: number;
  longitude: number;
  yearsOfExperience: number;
  dailyWage: number;
  availability: Availability;
  workingHours: string;
  preferredCategories: string[];
  languagesKnown: string[];
  rating?: number;
  reviews?: number;
  skill: string;
  totalJobsCompleted?: number;
  reliabilityScore?: number;
}

export interface RequestUpdate {
  name?: string;
  age?: number;
  phone?: string;
  village?: string;
  skill?: string;
  yearsOfExperience?: number;
  dailyWage?: number;
  availability?: Availability;
  workingHours?: string;
  preferredCategories?: string[];
  languagesKnown?: string[];
  totalJobsCompleted?: number;
}

// Employer Profile
export interface EmployerProfile {
  employerId: string;
  userID: string;
  employerName: string;
  employerEmail: string;
  employerPhone: string;
  aadhaarNumber: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
}

export interface RequestEmployer {
  userID: string;
  employerName: string;
  employerEmail: string;
  employerPhone: string;
  aadhaarNumber: string;
}

export interface ResponseEmployer {
  employerId: string;
  employerName: string;
}

// Nearby search
export interface NearbyRequest {
  longitude: number;
  latitude: number;
  radius: number; // in kilometers
}
