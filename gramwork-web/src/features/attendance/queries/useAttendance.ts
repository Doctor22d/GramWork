import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '@/features/attendance/api/attendanceService';
import { toast } from 'sonner';

export const attendanceKeys = {
  all: ['attendance'] as const,
  byJob: (jobId: string) => [...attendanceKeys.all, 'job', jobId] as const,
  byWorker: (workerId: string) => [...attendanceKeys.all, 'worker', workerId] as const,
  check: (assignmentId: string) => [...attendanceKeys.all, 'check', assignmentId] as const,
};

export function useAttendanceByJob(jobId?: string) {
  return useQuery({
    queryKey: attendanceKeys.byJob(jobId!),
    queryFn: () => attendanceService.getByJob(jobId!),
    enabled: !!jobId,
    staleTime: 60 * 1000,
  });
}

export function useAttendanceByWorker(workerId?: string) {
  return useQuery({
    queryKey: attendanceKeys.byWorker(workerId!),
    queryFn: () => attendanceService.getByWorker(workerId!),
    enabled: !!workerId,
    staleTime: 60 * 1000,
  });
}

export function useCheckAttendance(assignmentId?: string) {
  return useQuery({
    queryKey: attendanceKeys.check(assignmentId!),
    queryFn: () => attendanceService.isAttendanceMarked(assignmentId!),
    enabled: !!assignmentId,
  });
}

export function useAttendanceMutations() {
  const queryClient = useQueryClient();

  const createAttendance = useMutation({
    mutationFn: (assignmentId: string) => attendanceService.createAttendance(assignmentId),
    onSuccess: (_, assignmentId) => {
      toast.success('Attendance session created');
      queryClient.invalidateQueries({ queryKey: attendanceKeys.check(assignmentId) });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
    onError: () => toast.error('Failed to create attendance session'),
  });

  const markAttendance = useMutation({
    mutationFn: ({ attendanceId, workerId }: { attendanceId: string; workerId: string }) =>
      attendanceService.markAttendance(attendanceId, workerId),
    onSuccess: (_, { workerId }) => {
      toast.success('Attendance marked successfully');
      queryClient.invalidateQueries({ queryKey: attendanceKeys.byWorker(workerId) });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
    onError: () => toast.error('Failed to mark attendance'),
  });

  return {
    createAttendance: createAttendance.mutateAsync,
    isCreating: createAttendance.isPending,
    markAttendance: markAttendance.mutateAsync,
    isMarking: markAttendance.isPending,
  };
}
