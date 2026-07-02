import { PaymentMethodEnum, PaymentStatusEnum, InvoiceStatus } from './enums';

// Payment Model
export interface Payment {
  id: string;
  assignmentId: string;
  jobId: string;
  employerId: string;
  workerId: string;
  amount: number;
  status: PaymentStatusEnum;
  paymentMethod: PaymentMethodEnum;
  transactionId: string;
  paidAt: string;
  paidBy: string;
}

// Request DTOs
export interface CreatePaymentRequest {
  assignmentId: string;
  paymentMethod: PaymentMethodEnum;
  paidBy: string;
}

// Response DTOs
export interface PaymentResponse {
  id: string;
  assignmentId: string;
  jobId: string;
  workerId: string;
  employerId: string;
  amount: number;
  status: PaymentStatusEnum;
  paymentMethod: PaymentMethodEnum;
  transactionId: string;
  paidAt: string;
  paidBy: string;
}

// Invoice Model
export interface Invoice {
  id: string;
  invoiceNumber: string;
  paymentId: string;
  transactionId: string;
  assignmentId: string;
  employerId: string;
  workerId: string;
  jobId: string;
  employerName: string;
  workerName: string;
  totalAmount: number;
  invoiceStatus: InvoiceStatus;
  generatedDate: string;
  transactionDate: string;
  pdfFilePath: string;
}

// Invoice Request DTOs
export interface InvoiceRequest {
  paymentID: string;
}

// Invoice Response DTOs
export interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  paymentId: string;
  transactionId: string;
  assignmentId: string;
  employerId: string;
  workerId: string;
  jobId: string;
  employerName: string;
  workerName: string;
  totalAmount: number;
  invoiceStatus: InvoiceStatus;
  generatedDate: string;
  transactionDate: string;
}
