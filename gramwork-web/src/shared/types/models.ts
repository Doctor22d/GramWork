import { components as AuthComponents, operations as AuthOperations } from '../api/generated/auth';
import { components as JobComponents, operations as JobOperations } from '../api/generated/job';
import { components as AssignmentComponents } from '../api/generated/assignment';
import { components as PaymentComponents } from '../api/generated/payment';
import { components as AttendanceComponents } from '../api/generated/attendance';

export type Role = "Worker" | "Employer" | "Admin";
export type JobStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type Category = "FARMING" | "CONSTRUCTION" | "ELECTRICAL" | "PLUMBING" | "PAINTING" | "CARPENTRY" | "CLEANING" | "TRANSPORTATION" | "WELDING" | "OTHER";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type Availability = "AVAILABLE" | "UNAVAILABLE" | "BUSY";
export type AssignmentStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface GeoJsonPoint {
  type: string;
  coordinates: [number, number];
}

// Extract directly from OpenAPI generated schemas where available
export type RegisterRequest = AuthComponents['schemas']['RegisterRequest'];
export type LoginRequest = AuthComponents['schemas']['LoginRequest'];
export type OTPRequest = AuthComponents['schemas']['OTPRequest'];
export type ResetPasswordMailRequest = AuthComponents['schemas']['ResetPasswordMailRequest'];
export type ResetPasswordRequest = AuthComponents['schemas']['ResetPasswordRequest'];

export type RequestJobDB = JobComponents['schemas']['requestJobDB'];

// Fallback to minimal types for incomplete OpenAPI definitions from backend
export type AuthUser = any;
export type WorkerProfile = any;
export type EmployerProfile = any;
export type RequestWorker = any;
export type RequestEmployer = any;
export type RequestUpdate = any;
export type LocationUpdateRequest = any;
export type NearbyRequest = any;
export type RequestAttendance = any;

export type JobDB = any;
export type ResponseJobDB = any;

export type RequestAssig = any;
export type ResponseAssig = any;
export type AvailabilityRequest = any;
export type CompleteRequest = any;

export type CreatePaymentRequest = any;
export type PaymentResponse = any;
export type InvoiceRequest = any;
export type InvoiceResponse = any;

export type AttendanceResponse = any;
