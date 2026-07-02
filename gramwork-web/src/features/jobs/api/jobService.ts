import api from '@/shared/api/axios';
import type { RequestJobDB, ResponseJobDB, JobDB } from '@/shared/types/models';

// =============================================================================
// Job Service (Port 8082) — proxied through Next.js rewrites
// =============================================================================

export const jobService = {
  /** Post a new job. */
  postJob: async (jobData: RequestJobDB): Promise<ResponseJobDB> => {
    const response = await api.post('/api/job/postjob', jobData);
    return response.data;
  },

  /** Get a job by ID. */
  getJobById: async (jobId: string): Promise<JobDB> => {
    const response = await api.get(`/api/job/${jobId}`);
    return response.data;
  },

  /** Check if a job ID exists. */
  checkJobId: async (jobId: string): Promise<boolean> => {
    const response = await api.get(`/api/job/${jobId}/checkJobID`);
    return response.data;
  },

  /** Update the hired workers count for a job. */
  updateHiredWorkers: async (jobId: string, count: number): Promise<string> => {
    const response = await api.put(`/api/job/${jobId}/hired-workers?count=${count}`);
    return response.data;
  },
};
