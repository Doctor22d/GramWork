import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '@/features/jobs/api/jobService';
import type { RequestJobDB } from '@/shared/types/models';
import { toast } from 'sonner';

export const jobKeys = {
  all: ['jobs'] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
};

export function useJobs() {
  const queryClient = useQueryClient();

  const postJobMutation = useMutation({
    mutationFn: (data: RequestJobDB) => jobService.postJob(data),
    onSuccess: () => {
      toast.success('Job posted successfully');
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
    onError: (error: Error | unknown) => {
      const err = error as Record<string, unknown>;
      toast.error((err?.response as Record<string, unknown>)?.data as string || 'Failed to post job');
    },
  });

  const updateHiredWorkersMutation = useMutation({
    mutationFn: ({ jobId, count }: { jobId: string; count: number }) => 
      jobService.updateHiredWorkers(jobId, count),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
    },
  });

  return {
    postJob: postJobMutation.mutateAsync,
    isPostingJob: postJobMutation.isPending,
    updateHiredWorkers: updateHiredWorkersMutation.mutateAsync,
    isUpdatingHiredWorkers: updateHiredWorkersMutation.isPending,
  };
}

export function useJob(jobId?: string) {
  return useQuery({
    queryKey: jobKeys.detail(jobId!),
    queryFn: () => jobService.getJobById(jobId!),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Check job ID validation
export function useCheckJobId(jobId?: string) {
  return useQuery({
    queryKey: ['checkJobId', jobId],
    queryFn: () => jobService.checkJobId(jobId!),
    enabled: !!jobId,
    retry: false,
  });
}
