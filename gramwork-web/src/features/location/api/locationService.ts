import api from '@/shared/api/axios';
import { components } from '@/shared/api/generated/laborer';

type LocationUpdateRequest = components["schemas"]["LocationUpdateRequest"];
type NearbyRequest = components["schemas"]["nearbyRequest"];

export const locationService = {
  updateWorkerLocation: async (userId: string, lat: number, lng: number) => {
    const data: LocationUpdateRequest = { latitude: lat, longitude: lng };
    const response = await api.put('/api/worker/location', data, {
      params: { userId }
    });
    return response.data;
  },

  getNearbyWorkers: async (lat: number, lng: number, radius: number) => {
    const data: NearbyRequest = { latitude: lat, longitude: lng, radius };
    const response = await api.post('/api/employer/nearbyWorker', data);
    return response.data;
  },
  
  // Fallback if needed for Jobs Service
  getNearbyJobs: async (lat: number, lng: number, radius: number) => {
    // Requires a similar backend endpoint on Job service which wasn't in OpenAPI
    // Mock standard path for now:
    const response = await api.get('/api/job/nearby', { params: { lat, lng, radius } });
    return response.data;
  }
};
