import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { attendanceService } from '@/services/api';
import { QUERY_KEYS } from '@/config/constants';

export const useAttendance = (jobId?: string, workerId?: string) => {
  const queryClient = useQueryClient();

  // Get attendance by job ID
  const { data: jobAttendance, isLoading: isLoadingJobAttendance } = useQuery({
    queryKey: [QUERY_KEYS.ATTENDANCE, 'job', jobId],
    queryFn: () => attendanceService.getByJobId(jobId!),
    enabled: !!jobId,
  });

  // Get attendance by worker ID
  const { data: workerAttendance, isLoading: isLoadingWorkerAttendance } = useQuery({
    queryKey: [QUERY_KEYS.WORKER.ATTENDANCE, workerId],
    queryFn: () => attendanceService.getByWorkerId(workerId!),
    enabled: !!workerId,
  });

  // Create attendance
  const createAttendanceMutation = useMutation({
    mutationFn: attendanceService.createAttendance,
    onSuccess: () => {
      toast.success('Attendance record created!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTENDANCE] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to create attendance');
    },
  });

  // Mark attendance
  const markAttendanceMutation = useMutation({
    mutationFn: ({ attendanceId, workerId }: { attendanceId: string; workerId: string }) =>
      attendanceService.markAttendance(attendanceId, workerId),
    onSuccess: () => {
      toast.success('Attendance marked successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTENDANCE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER.ATTENDANCE] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to mark attendance');
    },
  });

  return {
    jobAttendance,
    workerAttendance,
    isLoadingJobAttendance,
    isLoadingWorkerAttendance,
    createAttendanceMutation,
    markAttendanceMutation,
  };
};
