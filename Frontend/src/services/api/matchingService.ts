import createAxiosInstance from './axiosInstance';
import { API_URLS } from '@/config/constants';
import { MatchingScoreResponse } from '@/types';

const matchingApi = createAxiosInstance(API_URLS.AI_MATCHING);

export const matchingService = {
  // Get top matching workers for a job
  findTopMatches: async (jobId: string, limit: number = 10): Promise<MatchingScoreResponse[]> => {
    const response = await matchingApi.get<MatchingScoreResponse[]>(
      `/api/Matching/job/${jobId}?limit=${limit}`
    );
    return response.data;
  },
};
