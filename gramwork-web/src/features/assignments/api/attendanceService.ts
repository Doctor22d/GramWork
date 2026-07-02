import api from '@/shared/api/axios';
import { components } from '@/shared/api/generated/attendance';

type AttendanceResponse = components["schemas"]["AttendanceResponse"];

export const attendanceService = {
  createAttendance: async (assignmentId: string) => {
    const response = await api.post(`/api/attendance/${assignmentId}/create`);
    return response.data;
  },

  markAttendance: async (attendanceId: string, workerId: string) => {
    const response = await api.put(`/api/attendance/${attendanceId}/worker/${workerId}/markAttendance`);
    return response.data;
  },

  getByWorker: async (workerId: string) => {
    const response = await api.get(`/api/attendance/worker/${workerId}`);
    return response.data as AttendanceResponse[];
  },

  getByJob: async (jobId: string) => {
    const response = await api.get(`/api/attendance/job/${jobId}`);
    return response.data as AttendanceResponse[];
  },

  isAttendanceMarked: async (assignmentId: string) => {
    const response = await api.get(`/api/attendance/check/${assignmentId}`);
    return response.data;
  }
};
