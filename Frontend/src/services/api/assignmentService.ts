import createAxiosInstance from './axiosInstance';
import { API_URLS } from '@/config/constants';
import {
  RequestAssig,
  ResponseAssig,
  AvailabilityRequest,
  CompleteRequest,
} from '@/types';

const assignmentApi = createAxiosInstance(API_URLS.ASSIGNMENT);

export const assignmentService = {
  // Create new assignment
  createAssignment: async (data: RequestAssig): Promise<ResponseAssig> => {
    const response = await assignmentApi.post<ResponseAssig>('/api/assignments/createAssignment', data);
    return response.data;
  },

  // Get assignment by ID
  getAssignmentById: async (assignmentId: string): Promise<ResponseAssig> => {
    const response = await assignmentApi.get<ResponseAssig>(`/api/assignments/${assignmentId}`);
    return response.data;
  },

  // Accept assignment
  acceptAssignment: async (assignmentId: string, data: AvailabilityRequest): Promise<ResponseAssig> => {
    const response = await assignmentApi.post<ResponseAssig>(
      `/api/assignments/${assignmentId}/accept`,
      data
    );
    return response.data;
  },

  // Reject assignment
  rejectAssignment: async (assignmentId: string): Promise<ResponseAssig> => {
    const response = await assignmentApi.put<ResponseAssig>(`/api/assignments/${assignmentId}/reject`);
    return response.data;
  },

  // Complete assignment
  completeAssignment: async (assignmentId: string, data: AvailabilityRequest): Promise<ResponseAssig> => {
    const response = await assignmentApi.put<ResponseAssig>(
      `/api/assignments/${assignmentId}/complete`,
      data
    );
    return response.data;
  },

  // Update payment status
  updatePayment: async (data: CompleteRequest): Promise<void> => {
    await assignmentApi.put('/api/assignments/updatePayment', data);
  },
};
