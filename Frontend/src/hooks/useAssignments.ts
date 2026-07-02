import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { assignmentService } from '@/services/api';
import { QUERY_KEYS } from '@/config/constants';
import { RequestAssig, AvailabilityRequest, CompleteRequest } from '@/types';

export const useAssignment = (assignmentId?: string) => {
  const queryClient = useQueryClient();

  // Get assignment by ID
  const { data: assignment, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.WORKER.ASSIGNMENTS, assignmentId],
    queryFn: () => assignmentService.getAssignmentById(assignmentId!),
    enabled: !!assignmentId,
  });

  // Create assignment
  const createAssignmentMutation = useMutation({
    mutationFn: assignmentService.createAssignment,
    onSuccess: () => {
      toast.success('Assignment created successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYER.ASSIGNMENTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to create assignment');
    },
  });

  // Accept assignment
  const acceptAssignmentMutation = useMutation({
    mutationFn: ({ assignmentId, data }: { assignmentId: string; data: AvailabilityRequest }) =>
      assignmentService.acceptAssignment(assignmentId, data),
    onSuccess: () => {
      toast.success('Assignment accepted!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER.ASSIGNMENTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to accept assignment');
    },
  });

  // Reject assignment
  const rejectAssignmentMutation = useMutation({
    mutationFn: assignmentService.rejectAssignment,
    onSuccess: () => {
      toast.success('Assignment rejected');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER.ASSIGNMENTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to reject assignment');
    },
  });

  // Complete assignment
  const completeAssignmentMutation = useMutation({
    mutationFn: ({ assignmentId, data }: { assignmentId: string; data: AvailabilityRequest }) =>
      assignmentService.completeAssignment(assignmentId, data),
    onSuccess: () => {
      toast.success('Assignment completed!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER.ASSIGNMENTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to complete assignment');
    },
  });

  // Update payment status
  const updatePaymentMutation = useMutation({
    mutationFn: assignmentService.updatePayment,
    onSuccess: () => {
      toast.success('Payment status updated!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER.ASSIGNMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER.PAYMENTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to update payment');
    },
  });

  return {
    assignment,
    isLoading,
    error,
    createAssignmentMutation,
    acceptAssignmentMutation,
    rejectAssignmentMutation,
    completeAssignmentMutation,
    updatePaymentMutation,
  };
};
