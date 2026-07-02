import createAxiosInstance from './axiosInstance';
import { API_URLS } from '@/config/constants';
import {
  CreatePaymentRequest,
  PaymentResponse,
  InvoiceRequest,
  InvoiceResponse,
} from '@/types';

const paymentApi = createAxiosInstance(API_URLS.PAYMENT);

export const paymentService = {
  // Create payment
  createPayment: async (data: CreatePaymentRequest): Promise<PaymentResponse> => {
    const response = await paymentApi.post<PaymentResponse>('/api/payment/create', data);
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (paymentId: string): Promise<PaymentResponse> => {
    const response = await paymentApi.get<PaymentResponse>(`/api/payment/${paymentId}`);
    return response.data;
  },

  // Get payment by assignment ID
  getPaymentByAssignment: async (assignmentId: string): Promise<PaymentResponse> => {
    const response = await paymentApi.get<PaymentResponse>(`/api/payment/assignment/${assignmentId}`);
    return response.data;
  },

  // Get payments by worker ID
  getPaymentsByWorker: async (workerId: string): Promise<PaymentResponse[]> => {
    const response = await paymentApi.get<PaymentResponse[]>(`/api/payment/worker/${workerId}`);
    return response.data;
  },

  // Get payments by employer ID
  getPaymentsByEmployer: async (employerId: string): Promise<PaymentResponse[]> => {
    const response = await paymentApi.get<PaymentResponse[]>(`/api/payment/employer/${employerId}`);
    return response.data;
  },

  // Get payments by job ID
  getPaymentsByJob: async (jobId: string): Promise<PaymentResponse[]> => {
    const response = await paymentApi.get<PaymentResponse[]>(`/api/payment/job/${jobId}`);
    return response.data;
  },
};

export const invoiceService = {
  // Create invoice
  createInvoice: async (data: InvoiceRequest): Promise<InvoiceResponse> => {
    const response = await paymentApi.post<InvoiceResponse>('/api/invoice/createInvoice', data);
    return response.data;
  },

  // Generate PDF invoice
  generatePDF: async (invoiceId: string): Promise<Blob> => {
    const response = await paymentApi.get(`/api/invoice/${invoiceId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
