import createAxiosInstance from './axiosInstance';
import { API_URLS } from '@/config/constants';
import {
  WorkerProfile,
  RequestWorker,
  RequestUpdate,
  EmployerProfile,
  RequestEmployer,
  ResponseEmployer,
  NearbyRequest,
  LocationUpdateRequest,
} from '@/types';

const profileApi = createAxiosInstance(API_URLS.PROFILE);

// Worker Profile Service
export const workerProfileService = {
  // Register worker profile
  register: async (data: RequestWorker): Promise<string> => {
    const response = await profileApi.post<string>('/api/worker/register-worker', data);
    return response.data;
  },

  // Get worker profile
  getProfile: async (userId: string): Promise<WorkerProfile> => {
    const response = await profileApi.get<WorkerProfile>(`/api/worker/get-worker/${userId}`);
    return response.data;
  },

  // Update worker profile
  updateProfile: async (userId: string, data: RequestUpdate): Promise<string> => {
    const response = await profileApi.put<string>(`/api/worker/profile?userId=${userId}`, data);
    return response.data;
  },

  // Update location
  updateLocation: async (userId: string, data: LocationUpdateRequest): Promise<string> => {
    const response = await profileApi.put<string>(`/api/worker/location?userId=${userId}`, data);
    return response.data;
  },

  // Update availability
  updateAvailability: async (userId: string, status: string): Promise<void> => {
    await profileApi.put(`/api/worker/${userId}/availability`, status, {
      headers: { 'Content-Type': 'text/plain' },
    });
  },

  // Check worker ID exists
  checkWorkerID: async (userId: string): Promise<string> => {
    const response = await profileApi.get<string>(`/api/worker/${userId}/checkWorkerID`);
    return response.data;
  },

  // Update job completion count
  updateJobComplete: async (userId: string): Promise<void> => {
    await profileApi.put(`/api/worker/${userId}/updateJobComplete`);
  },
};

// Employer Profile Service
export const employerProfileService = {
  // Register employer profile
  register: async (data: RequestEmployer): Promise<ResponseEmployer> => {
    const response = await profileApi.post<ResponseEmployer>('/api/employer/register', data);
    return response.data;
  },

  // Get employer profile
  getProfile: async (employerId: string): Promise<EmployerProfile> => {
    const response = await profileApi.get<EmployerProfile>(`/api/employer/get-employer/${employerId}`);
    return response.data;
  },

  // Check employer ID exists
  checkEmployerID: async (employerId: string): Promise<boolean> => {
    const response = await profileApi.get<boolean>(`/api/employer/${employerId}/CheckEmployerID`);
    return response.data;
  },

  // Find nearby workers
  findNearbyWorkers: async (data: NearbyRequest): Promise<WorkerProfile[]> => {
    const response = await profileApi.post<WorkerProfile[]>('/api/employer/nearbyWorker', data);
    return response.data;
  },

  // Find nearby workers for AI matching
  findNearbyWorkersForMatching: async (latitude: number, longitude: number): Promise<WorkerProfile[]> => {
    const response = await profileApi.get<WorkerProfile[]>(
      `/api/employer/nearbyWorkerforMatching?latitude=${latitude}&longitude=${longitude}`
    );
    return response.data;
  },
};
