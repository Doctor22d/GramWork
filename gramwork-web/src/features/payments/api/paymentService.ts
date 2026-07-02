import api from '@/shared/api/axios';
import type { 
  CreatePaymentRequest, 
  PaymentResponse, 
  InvoiceRequest, 
  InvoiceResponse 
} from '@/shared/types/models';

// =============================================================================
// Payment & Invoice Service (Port 8084) — proxied through Next.js rewrites
// =============================================================================

export const paymentService = {
  /** Create a payment. */
  createPayment: async (data: CreatePaymentRequest): Promise<PaymentResponse> => {
    const response = await api.post('/api/payment/create', data);
    return response.data;
  },

  /** Get payment by ID. */
  getPaymentById: async (paymentId: string): Promise<PaymentResponse> => {
    const response = await api.get(`/api/payment/${paymentId}`);
    return response.data;
  },

  /** Get payment by assignment ID. */
  getPaymentByAssignment: async (assignmentId: string): Promise<PaymentResponse> => {
    const response = await api.get(`/api/payment/assignment/${assignmentId}`);
    return response.data;
  },

  /** Get all payments by worker ID. */
  getPaymentsByWorker: async (workerId: string): Promise<PaymentResponse[]> => {
    const response = await api.get(`/api/payment/worker/${workerId}`);
    return response.data;
  },

  /** Get all payments by employer ID. */
  getPaymentsByEmployer: async (employerId: string): Promise<PaymentResponse[]> => {
    const response = await api.get(`/api/payment/employer/${employerId}`);
    return response.data;
  },

  /** Get all payments by job ID. */
  getPaymentsByJob: async (jobId: string): Promise<PaymentResponse[]> => {
    const response = await api.get(`/api/payment/job/${jobId}`);
    return response.data;
  },

  /** Create an invoice for a payment. */
  createInvoice: async (data: InvoiceRequest): Promise<InvoiceResponse> => {
    const response = await api.post('/api/invoice/createInvoice', data);
    return response.data;
  },

  /** Download invoice PDF. */
  downloadInvoicePdf: async (invoiceId: string): Promise<Blob> => {
    const response = await api.get(`/api/invoice/${invoiceId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
