import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { paymentService, invoiceService } from '@/services/api';
import { QUERY_KEYS } from '@/config/constants';
import { CreatePaymentRequest, InvoiceRequest } from '@/types';

export const usePayments = (workerId?: string, employerId?: string) => {
  const queryClient = useQueryClient();

  // Get payments by worker
  const { data: workerPayments, isLoading: isLoadingWorkerPayments } = useQuery({
    queryKey: [QUERY_KEYS.WORKER.PAYMENTS, workerId],
    queryFn: () => paymentService.getPaymentsByWorker(workerId!),
    enabled: !!workerId,
  });

  // Get payments by employer
  const { data: employerPayments, isLoading: isLoadingEmployerPayments } = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYER.PAYMENTS, employerId],
    queryFn: () => paymentService.getPaymentsByEmployer(employerId!),
    enabled: !!employerId,
  });

  // Create payment
  const createPaymentMutation = useMutation({
    mutationFn: paymentService.createPayment,
    onSuccess: () => {
      toast.success('Payment created successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER.PAYMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYER.PAYMENTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to create payment');
    },
  });

  // Create invoice
  const createInvoiceMutation = useMutation({
    mutationFn: invoiceService.createInvoice,
    onSuccess: () => {
      toast.success('Invoice generated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to generate invoice');
    },
  });

  // Download invoice PDF
  const downloadInvoicePDF = async (invoiceId: string, invoiceNumber: string) => {
    try {
      const blob = await invoiceService.generatePDF(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded!');
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to download invoice');
    }
  };

  return {
    workerPayments,
    employerPayments,
    isLoadingWorkerPayments,
    isLoadingEmployerPayments,
    createPaymentMutation,
    createInvoiceMutation,
    downloadInvoicePDF,
  };
};
