import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { jobService } from '@/services/api';
import { QUERY_KEYS } from '@/config/constants';
import { RequestJobDB } from '@/types';

export const useJob = (jobId?: string) => {
  const queryClient = useQueryClient();

  // Get job by ID
  const { data: job, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYER.JOB_DETAIL, jobId],
    queryFn: () => jobService.getJobById(jobId!),
    enabled: !!jobId,
  });

  // Create job
  const createJobMutation = useMutation({
    mutationFn: jobService.createJob,
    onSuccess: () => {
      toast.success('Job posted successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYER.JOBS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to create job');
    },
  });

  // Update hired workers count
  const updateHiredWorkersMutation = useMutation({
    mutationFn: ({ jobId, count }: { jobId: string; count: number }) =>
      jobService.updateHiredWorkers(jobId, count),
    onSuccess: () => {
      toast.success('Hired workers updated!');
      if (jobId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYER.JOB_DETAIL, jobId] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to update hired workers');
    },
  });

  return {
    job,
    isLoading,
    error,
    createJobMutation,
    updateHiredWorkersMutation,
  };
};
