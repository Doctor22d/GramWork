import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/features/payments/api/paymentService';
import type { CreatePaymentRequest, InvoiceRequest } from '@/shared/types/models';
import { toast } from 'sonner';

export const paymentKeys = {
  all: ['payments'] as const,
  detail: (id: string) => [...paymentKeys.all, id] as const,
  byAssignment: (assignmentId: string) => [...paymentKeys.all, 'assignment', assignmentId] as const,
  byWorker: (workerId: string) => [...paymentKeys.all, 'worker', workerId] as const,
  byEmployer: (employerId: string) => [...paymentKeys.all, 'employer', employerId] as const,
  byJob: (jobId: string) => [...paymentKeys.all, 'job', jobId] as const,
};

export function usePayment(paymentId?: string) {
  return useQuery({
    queryKey: paymentKeys.detail(paymentId!),
    queryFn: () => paymentService.getPaymentById(paymentId!),
    enabled: !!paymentId,
  });
}

export function usePaymentByAssignment(assignmentId?: string) {
  return useQuery({
    queryKey: paymentKeys.byAssignment(assignmentId!),
    queryFn: () => paymentService.getPaymentByAssignment(assignmentId!),
    enabled: !!assignmentId,
  });
}

export function usePaymentsByWorker(workerId?: string) {
  return useQuery({
    queryKey: paymentKeys.byWorker(workerId!),
    queryFn: () => paymentService.getPaymentsByWorker(workerId!),
    enabled: !!workerId,
  });
}

export function usePaymentsByEmployer(employerId?: string) {
  return useQuery({
    queryKey: paymentKeys.byEmployer(employerId!),
    queryFn: () => paymentService.getPaymentsByEmployer(employerId!),
    enabled: !!employerId,
  });
}

export function usePaymentMutations() {
  const queryClient = useQueryClient();

  const createPayment = useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentService.createPayment(data),
    onSuccess: (data) => {
      toast.success('Payment initiated successfully');
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.setQueryData(paymentKeys.detail(data.id), data);
    },
    onError: () => toast.error('Failed to initiate payment'),
  });

  const createInvoice = useMutation({
    mutationFn: (data: InvoiceRequest) => paymentService.createInvoice(data),
    onSuccess: () => toast.success('Invoice generated successfully'),
    onError: () => toast.error('Failed to generate invoice'),
  });

  const downloadInvoice = useMutation({
    mutationFn: (invoiceId: string) => paymentService.downloadInvoicePdf(invoiceId),
    onSuccess: (blob, invoiceId) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Invoice downloaded');
    },
    onError: () => toast.error('Failed to download invoice'),
  });

  return {
    createPayment: createPayment.mutateAsync,
    isCreatingPayment: createPayment.isPending,
    createInvoice: createInvoice.mutateAsync,
    isCreatingInvoice: createInvoice.isPending,
    downloadInvoice: downloadInvoice.mutateAsync,
    isDownloadingInvoice: downloadInvoice.isPending,
  };
}
