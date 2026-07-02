// Enums matching backend exactly

export enum Role {
  Worker = 'Worker',
  Employer = 'Employer',
  Admin = 'Admin',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum Availability {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum Category {
  FARMING = 'FARMING',
  CONSTRUCTION = 'CONSTRUCTION',
  ELECTRICAL = 'ELECTRICAL',
  PLUMBING = 'PLUMBING',
  PAINTING = 'PAINTING',
  CARPENTRY = 'CARPENTRY',
  CLEANING = 'CLEANING',
  TRANSPORTATION = 'TRANSPORTATION',
  WELDING = 'WELDING',
  OTHER = 'OTHER',
}

export enum JobStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum UrgencyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AssignmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum PaymentMethodEnum {
  UPI = 'UPI',
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatusEnum {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
}

export enum InvoiceStatus {
  GENERATED = 'GENERATED',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum MessageType {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
}
