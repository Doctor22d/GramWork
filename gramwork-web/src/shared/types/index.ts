export type Role = 'EMPLOYER' | 'WORKER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phoneNumber?: string;
  village?: string;
}

export interface Job {
  jobId: string;
  employerId: string;
  employerName: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string;
  requiredWorkers: number;
  hiredWorkers: number;
  wage: number;
  duration: string;
  urgencyLevel: string;
  latitude: number;
  longitude: number;
  address: string;
  village: string;
  pincode: string;
  workImages: string[];
  startDate: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  createdAt: string;
}

export interface Assignment {
  assignmentId: string;
  jobId: string;
  employerId: string;
  workerId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  matchScore: number;
  totalWage: number;
  startedDate: string;
  finishDate: string;
}

export interface Attendance {
  id: string;
  assignmentId: string;
  workerId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT';
}

export interface Payment {
  id: string;
  assignmentId: string;
  amount: number;
  paymentMethod: string;
  paidBy: string;
  status: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  message: string;
  type: 'SYSTEM_INFO' | 'JOB_ALERT' | 'PAYMENT' | 'ATTENDANCE';
  isRead: boolean;
  createdAt: string;
}
