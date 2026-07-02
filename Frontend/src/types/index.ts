// Export all types from a single entry point
export * from './enums';
export * from './auth.types';
export * from './profile.types';
export * from './job.types';
export * from './assignment.types';
export * from './attendance.types';
export * from './payment.types';
export * from './notification.types';
export * from './matching.types';

// Common API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Common pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Common filter types
export interface DateRange {
  startDate: string;
  endDate: string;
}

// Error response
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
