import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workerProfileService } from '@/services/api';
import { QUERY_KEYS } from '@/config/constants';
import { RequestWorker, RequestUpdate, LocationUpdateRequest } from '@/types';

export const useWorkerProfile = (userId?: string) => {
  const queryClient = useQueryClient();

  // Get worker profile
  const { data: profile, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.WORKER.PROFILE, userId],
    queryFn: () => workerProfileService.getProfile(userId!),
    enabled: !!userId,
  });

  // Register worker profile
  const registerMutation = useMutation({
    mutationFn: workerProfileService.register,
    onSuccess: () => {
      toast.success('Worker profile created successfully!');
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER.PROFILE, userId] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to create profile');
    },
  });

  // Update worker profile
  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: RequestUpdate }) =>
      workerProfileService.updateProfile(userId, data),
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER.PROFILE, userId] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to update profile');
    },
  });

  // Update location
  const updateLocationMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: LocationUpdateRequest }) =>
      workerProfileService.updateLocation(userId, data),
    onSuccess: () => {
      toast.success('Location updated successfully!');
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER.PROFILE, userId] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to update location');
    },
  });

  // Update availability
  const updateAvailabilityMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      workerProfileService.updateAvailability(userId, status),
    onSuccess: () => {
      toast.success('Availability updated!');
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER.PROFILE, userId] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to update availability');
    },
  });

  return {
    profile,
    isLoading,
    error,
    registerMutation,
    updateMutation,
    updateLocationMutation,
    updateAvailabilityMutation,
  };
};
