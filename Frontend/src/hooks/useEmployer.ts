import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { employerProfileService } from '@/services/api';
import { QUERY_KEYS } from '@/config/constants';
import { RequestEmployer, NearbyRequest } from '@/types';

export const useEmployerProfile = (employerId?: string) => {
  const queryClient = useQueryClient();

  // Get employer profile
  const { data: profile, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYER.PROFILE, employerId],
    queryFn: () => employerProfileService.getProfile(employerId!),
    enabled: !!employerId,
  });

  // Register employer profile
  const registerMutation = useMutation({
    mutationFn: employerProfileService.register,
    onSuccess: () => {
      toast.success('Employer profile created successfully!');
      if (employerId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYER.PROFILE, employerId] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to create profile');
    },
  });

  // Find nearby workers
  const findNearbyWorkersMutation = useMutation({
    mutationFn: employerProfileService.findNearbyWorkers,
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to find nearby workers');
    },
  });

  return {
    profile,
    isLoading,
    error,
    registerMutation,
    findNearbyWorkersMutation,
  };
};

// Hook for finding nearby workers for matching
export const useNearbyWorkers = (latitude?: number, longitude?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EMPLOYER.NEARBY_WORKERS, latitude, longitude],
    queryFn: () => employerProfileService.findNearbyWorkersForMatching(latitude!, longitude!),
    enabled: !!latitude && !!longitude,
  });
};
