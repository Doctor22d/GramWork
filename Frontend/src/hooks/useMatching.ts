import { useQuery } from '@tanstack/react-query';
import { matchingService } from '@/services/api';
import { QUERY_KEYS } from '@/config/constants';

export const useMatching = (jobId?: string, limit: number = 10) => {
  const { data: matches, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYER.MATCHING, jobId, limit],
    queryFn: () => matchingService.findTopMatches(jobId!, limit),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes - matching results don't change frequently
  });

  return {
    matches,
    isLoading,
    error,
  };
};
