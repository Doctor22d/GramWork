import { AssignmentStatus, PaymentStatus } from './enums';

// Assignment Model
export interface Assignment {
  assignmentId: string;
  jobId: string;
  workerIdList: string[];
  employerId: string;
  matchScore: number;
  totalWage: number;
  status: AssignmentStatus;
  paymentStatus: PaymentStatus;
  assignedDate: string;
  startedDate: string;
  completedDate: string;
}

// Request DTOs
export interface RequestAssig {
  jobId: string;
  workerId: string;
  employerId: string;
  matchScore?: number;
  totalWage?: number;
  startedDate?: string;
  finishDate?: string;
}

export interface AvailabilityRequest {
  workerId: string;
  JobID: string;
}

export interface CompleteRequest {
  assignmentId: string;
  totalWage: number;
  paymentStatus: PaymentStatus;
}

// Response DTOs
export interface ResponseAssig {
  assignmentId: string;
  jobId: string;
  workerIdList: string[];
  employerId: string;
  matchScore: number;
  totalWage: number;
  status: AssignmentStatus;
  paymentStatus: PaymentStatus;
  assignedDate: string;
  startedDate: string;
  completedDate: string;
}
