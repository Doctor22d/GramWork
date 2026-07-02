import { Category, JobStatus, UrgencyLevel } from './enums';
import { GeoJsonPoint } from './profile.types';

// Job Model
export interface JobDB {
  id: string;
  employerId: string;
  employerName: string;
  title: string;
  description: string;
  category: Category;
  requiredSkills: string;
  requiredWorkers: number;
  hiredWorkers: number;
  wage: number;
  duration: string;
  urgencyLevel: UrgencyLevel;
  location: GeoJsonPoint;
  address: string;
  village: string;
  pincode: string;
  workImages: string[];
  status: JobStatus;
  startDate: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

// Request DTOs
export interface RequestJobDB {
  employerId: string;
  employerName: string;
  title: string;
  description?: string;
  category: Category;
  requiredSkills?: string;
  requiredWorkers: number;
  wage: number;
  duration?: string;
  urgencyLevel: UrgencyLevel;
  latitude: number;
  longitude: number;
  address: string;
  village?: string;
  pincode?: string;
  workImages?: string[];
  status?: JobStatus;
  startDate: string;
  deadline?: string;
}

// Response DTOs
export interface ResponseJobDB {
  jobId: string;
  employerId: string;
  employerName: string;
  title: string;
  status: JobStatus;
}
