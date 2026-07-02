import createAxiosInstance from './axiosInstance';
import { API_URLS } from '@/config/constants';
import { RequestJobDB, ResponseJobDB, JobDB } from '@/types';

const jobApi = createAxiosInstance(API_URLS.JOB);

export const jobService = {
  // Create new job posting
  createJob: async (data: RequestJobDB): Promise<ResponseJobDB> => {
    const response = await jobApi.post<ResponseJobDB>('/api/job/postjob', data);
    return response.data;
  },

  // Get job by ID
  getJobById: async (jobId: string): Promise<JobDB> => {
    const response = await jobApi.get<JobDB>(`/api/job/${jobId}`);
    return response.data;
  },

  // Check if job ID exists
  checkJobID: async (jobId: string): Promise<boolean> => {
    const response = await jobApi.get<boolean>(`/api/job/${jobId}/checkJobID`);
    return response.data;
  },

  // Update hired workers count
  updateHiredWorkers: async (jobId: string, count: number): Promise<string> => {
    const response = await jobApi.put<string>(
      `/api/job/${jobId}/hired-workers?count=${count}`
    );
    return response.data;
  },
};
