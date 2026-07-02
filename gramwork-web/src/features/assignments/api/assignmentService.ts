import api from '@/shared/api/axios';
import { components } from '@/shared/api/generated/assignment';

type RequestAssignment = components["schemas"]["requestAssig"];
type ResponseAssignment = components["schemas"]["responseAssig"];
type AvailabilityRequest = components["schemas"]["AvailabilityRequest"];
type CompleteRequest = components["schemas"]["CompleteRequest"];

export const assignmentService = {
  createAssignment: async (data: RequestAssignment) => {
    const response = await api.post('/api/assignments/createAssignment', data);
    return response.data as ResponseAssignment;
  },
  
  getAssignmentById: async (id: string) => {
    const response = await api.get(`/api/assignments/${id}`);
    return response.data as ResponseAssignment;
  },

  acceptAssignment: async (id: string, data: AvailabilityRequest) => {
    const response = await api.put(`/api/assignments/${id}/accept`, data);
    return response.data;
  },

  rejectAssignment: async (id: string) => {
    const response = await api.put(`/api/assignments/${id}/reject`);
    return response.data;
  },

  completeAssignment: async (id: string, data: AvailabilityRequest) => {
    const response = await api.put(`/api/assignments/${id}/complete`, data);
    return response.data;
  },

  updatePayment: async (data: CompleteRequest) => {
    const response = await api.put(`/api/assignments/updatePayment`, data);
    return response.data;
  },

  // Fallback for listings
  getAssignments: async (params?: any) => {
    const response = await api.get('/api/assignments', { params });
    return response.data;
  }
};
