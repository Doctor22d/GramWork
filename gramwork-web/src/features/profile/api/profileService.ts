import api from '@/shared/api/axios';
import type { 
  RequestEmployer, 
  EmployerProfile, 
  NearbyRequest, 
  WorkerProfile, 
  RequestAttendance,
  RequestWorker,
  RequestUpdate,
  LocationUpdateRequest,
  Availability
} from '@/shared/types/models';

// =============================================================================
// Laborer Profile Service (Port 8081) — proxied through Next.js rewrites
// Manages employer and worker profiles.
// =============================================================================

export const employerProfileService = {
  /** Register an employer profile. */
  register: async (data: RequestEmployer): Promise<EmployerProfile> => {
    const response = await api.post('/api/employer/register', data);
    return response.data;
  },

  /** Get employer profile by ID. */
  getEmployer: async (employerId: string): Promise<EmployerProfile> => {
    const response = await api.get(`/api/employer/get-employer/${employerId}`);
    return response.data;
  },

  /** Check if employer ID exists. */
  checkEmployerId: async (employerId: string): Promise<boolean> => {
    const response = await api.get(`/api/employer/${employerId}/CheckEmployerID`);
    return response.data;
  },

  /** Find nearby workers. */
  findNearbyWorkers: async (data: NearbyRequest): Promise<WorkerProfile[]> => {
    const response = await api.post('/api/employer/nearbyWorker', data);
    return response.data;
  },

  /** Mark attendance. */
  markAttendance: async (data: RequestAttendance): Promise<string> => {
    const response = await api.put('/api/employer/markAttendance', data);
    return response.data;
  },
};

export const workerProfileService = {
  /** Register a new worker. */
  register: async (data: RequestWorker): Promise<string> => {
    const response = await api.post('/api/worker/register-worker', data);
    return response.data;
  },

  /** Get worker profile by ID. */
  getWorker: async (workerId: string): Promise<WorkerProfile> => {
    const response = await api.get(`/api/worker/get-worker/${workerId}`);
    return response.data;
  },

  /** Update worker profile. */
  updateProfile: async (userId: string, data: RequestUpdate): Promise<string> => {
    const response = await api.put(`/api/worker/profile?userId=${userId}`, data);
    return response.data;
  },

  /** Check if worker ID exists. */
  checkWorkerId: async (workerId: string): Promise<string> => {
    const response = await api.get(`/api/worker/${workerId}/checkWorkerID`);
    return response.data;
  },

  /** Update worker GPS location. */
  updateLocation: async (userId: string, data: LocationUpdateRequest): Promise<string> => {
    const response = await api.put(`/api/worker/location?userId=${userId}`, data);
    return response.data;
  },

  /** Update worker availability. */
  updateAvailability: async (workerId: string, status: Availability): Promise<void> => {
    const response = await api.put(`/api/worker/${workerId}/availability`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  /** Mark job as completed for a worker. */
  updateJobComplete: async (workerId: string): Promise<void> => {
    const response = await api.put(`/api/worker/${workerId}/updateJobComplete`);
    return response.data;
  },
};
