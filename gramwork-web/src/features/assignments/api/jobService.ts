import api from '@/shared/api/axios';
import { components } from '@/shared/api/generated/job';

type JobDB = components["schemas"]["requestJobDB"];

export const jobService = {
  postJob: async (data: JobDB) => {
    const response = await api.post('/api/job/postjob', data);
    return response.data;
  },
  
  getJobById: async (id: string) => {
    const response = await api.get(`/api/job/${id}`);
    return response.data as JobDB;
  },

  checkJobID: async (id: string) => {
    const response = await api.get(`/api/job/${id}/checkJobID`);
    return response.data;
  },

  updateHireWorkers: async (jobId: string, count: number) => {
    const response = await api.put(`/api/job/${jobId}/hired-workers`, null, {
      params: { count }
    });
    return response.data;
  },

  // Fallback endpoint if list API doesn't exist yet but UI requires it
  getAllJobs: async (params?: any) => {
    const response = await api.get('/api/job', { params });
    return response.data; // Expected to return paginated array
  }
};
