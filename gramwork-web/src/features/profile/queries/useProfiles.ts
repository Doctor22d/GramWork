import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employerProfileService, workerProfileService } from '@/features/profile/api/profileService';
import type { 
  RequestEmployer, 
  RequestWorker, 
  NearbyRequest, 
  RequestUpdate,
  LocationUpdateRequest,
  Availability,
  RequestAttendance
} from '@/shared/types/models';
import { toast } from 'sonner';

export const profileKeys = {
  employer: (id: string) => ['employer', id] as const,
  worker: (id: string) => ['worker', id] as const,
  nearbyWorkers: (req: NearbyRequest) => ['nearbyWorkers', req] as const,
};

// =============================================================================
// Employer Hooks
// =============================================================================

export function useEmployerProfile(employerId?: string) {
  return useQuery({
    queryKey: profileKeys.employer(employerId!),
    queryFn: () => employerProfileService.getEmployer(employerId!),
    enabled: !!employerId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEmployerMutations() {
  const queryClient = useQueryClient();

  const register = useMutation({
    mutationFn: (data: RequestEmployer) => employerProfileService.register(data),
    onSuccess: (data) => {
      toast.success('Employer profile created successfully');
      queryClient.invalidateQueries({ queryKey: profileKeys.employer(data.employerId) });
    },
    onError: () => toast.error('Failed to create employer profile'),
  });

  const markAttendance = useMutation({
    mutationFn: (data: RequestAttendance) => employerProfileService.markAttendance(data),
    onSuccess: () => toast.success('Attendance marked successfully'),
    onError: () => toast.error('Failed to mark attendance'),
  });

  return {
    register: register.mutateAsync,
    isRegistering: register.isPending,
    markAttendance: markAttendance.mutateAsync,
    isMarkingAttendance: markAttendance.isPending,
  };
}

export function useNearbyWorkers(data: NearbyRequest | null) {
  return useQuery({
    queryKey: profileKeys.nearbyWorkers(data!),
    queryFn: () => employerProfileService.findNearbyWorkers(data!),
    enabled: !!data,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useCheckEmployerId(employerId?: string) {
  return useQuery({
    queryKey: ['checkEmployerId', employerId],
    queryFn: () => employerProfileService.checkEmployerId(employerId!),
    enabled: !!employerId,
    retry: false,
  });
}

// =============================================================================
// Worker Hooks
// =============================================================================

export function useWorkerProfile(workerId?: string) {
  return useQuery({
    queryKey: profileKeys.worker(workerId!),
    queryFn: () => workerProfileService.getWorker(workerId!),
    enabled: !!workerId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorkerMutations() {
  const queryClient = useQueryClient();

  const register = useMutation({
    mutationFn: (data: RequestWorker) => workerProfileService.register(data),
    onSuccess: () => toast.success('Worker profile created successfully'),
    onError: () => toast.error('Failed to create worker profile'),
  });

  const updateProfile = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: RequestUpdate }) => 
      workerProfileService.updateProfile(userId, data),
    onSuccess: (_, { userId }) => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: profileKeys.worker(userId) });
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const updateLocation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: LocationUpdateRequest }) =>
      workerProfileService.updateLocation(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.worker(userId) });
    },
  });

  const updateAvailability = useMutation({
    mutationFn: ({ workerId, status }: { workerId: string; status: Availability }) =>
      workerProfileService.updateAvailability(workerId, status),
    onSuccess: (_, { workerId }) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.worker(workerId) });
    },
  });

  const markJobComplete = useMutation({
    mutationFn: (workerId: string) => workerProfileService.updateJobComplete(workerId),
    onSuccess: (_, workerId) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.worker(workerId) });
    },
  });

  return {
    register: register.mutateAsync,
    isRegistering: register.isPending,
    updateProfile: updateProfile.mutateAsync,
    isUpdatingProfile: updateProfile.isPending,
    updateLocation: updateLocation.mutateAsync,
    isUpdatingLocation: updateLocation.isPending,
    updateAvailability: updateAvailability.mutateAsync,
    isUpdatingAvailability: updateAvailability.isPending,
    markJobComplete: markJobComplete.mutateAsync,
    isMarkingJobComplete: markJobComplete.isPending,
  };
}

export function useCheckWorkerId(workerId?: string) {
  return useQuery({
    queryKey: ['checkWorkerId', workerId],
    queryFn: () => workerProfileService.checkWorkerId(workerId!),
    enabled: !!workerId,
    retry: false,
  });
}
