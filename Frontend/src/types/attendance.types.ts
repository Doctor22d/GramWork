// Attendance Model
export interface Attendance {
  id: string;
  EmployerID: string;
  JobID: string;
  WorkDate: string;
  Workers: string[];
  WorkerWithPresentDate: Record<string, string>;
  CreateDate: string;
  UpdateDate: string;
}

// Request DTOs
export interface AttendanceRequest {
  jobId: string;
  employerId: string;
  workDate: string;
  workers: string[];
}

// Response DTOs
export interface AttendanceResponse {
  AttendanceID: string;
  EmployerID: string;
  JobID: string;
  WorkDate: string;
  Workers: string[];
  WorkerWithPresentDate: Record<string, string>;
}
