import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '@/features/assignments/api/assignmentService';
import type { RequestAssig } from '@/shared/types/models';
import { toast } from 'sonner';

export const assignmentKeys = {
  all: ['assignments'] as const,
  detail: (id: string) => [...assignmentKeys.all, id] as const,
};

export function useAssignment(assignmentId?: string) {
  return useQuery({
    queryKey: assignmentKeys.detail(assignmentId!),
    queryFn: () => assignmentService.getAssignmentById(assignmentId!),
    enabled: !!assignmentId,
    staleTime: 60 * 1000,
  });
}

export function useAssignmentMutations() {
  const queryClient = useQueryClient();

  const createAssignment = useMutation({
    mutationFn: (data: RequestAssig) => assignmentService.createAssignment(data),
    onSuccess: (data) => {
      toast.success('Assignment created successfully');
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
      if (data.assignmentId) {
        queryClient.setQueryData(assignmentKeys.detail(data.assignmentId), data);
      }
    },
    onError: () => toast.error('Failed to create assignment'),
  });

  const acceptAssignment = useMutation({
    mutationFn: ({ assignmentId, data }: { assignmentId: string; data: { workerId: string; JobID: string } }) =>
      assignmentService.acceptAssignment(assignmentId, data),
    onSuccess: (data) => {
      toast.success('Assignment accepted');
      if (data?.assignmentId) {
        queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(data.assignmentId) });
      }
    },
    onError: () => toast.error('Failed to accept assignment'),
  });

  const rejectAssignment = useMutation({
    mutationFn: (assignmentId: string) => assignmentService.rejectAssignment(assignmentId),
    onSuccess: (data) => {
      toast.success('Assignment rejected');
      if (data?.assignmentId) {
        queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(data.assignmentId) });
      }
    },
    onError: () => toast.error('Failed to reject assignment'),
  });

  const completeAssignment = useMutation({
    mutationFn: ({ assignmentId, data }: { assignmentId: string; data: { workerId: string; JobID: string } }) =>
      assignmentService.completeAssignment(assignmentId, data),
    onSuccess: (data) => {
      toast.success('Assignment marked as complete');
      if (data?.assignmentId) {
        queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(data.assignmentId) });
      }
    },
    onError: () => toast.error('Failed to complete assignment'),
  });

  const updatePayment = useMutation({
    mutationFn: (data: Record<string, unknown>) => assignmentService.updatePayment(data),
    onSuccess: (data) => {
      toast.success('Payment status updated');
      if (data?.assignmentId) {
        queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(data.assignmentId) });
      }
    },
    onError: () => toast.error('Failed to update payment status'),
  });

  return {
    createAssignment: createAssignment.mutateAsync,
    isCreating: createAssignment.isPending,
    acceptAssignment: acceptAssignment.mutateAsync,
    isAccepting: acceptAssignment.isPending,
    rejectAssignment: rejectAssignment.mutateAsync,
    isRejecting: rejectAssignment.isPending,
    completeAssignment: completeAssignment.mutateAsync,
    isCompleting: completeAssignment.isPending,
    updatePayment: updatePayment.mutateAsync,
    isUpdatingPayment: updatePayment.isPending,
  };
}
