import createAxiosInstance from './axiosInstance';
import { API_URLS } from '@/config/constants';
import { AttendanceResponse } from '@/types';

const attendanceApi = createAxiosInstance(API_URLS.ATTENDANCE);

export const attendanceService = {
  // Create attendance record
  createAttendance: async (assignmentId: string): Promise<AttendanceResponse> => {
    const response = await attendanceApi.post<AttendanceResponse>(
      `/api/attendance/${assignmentId}/create`
    );
    return response.data;
  },

  // Mark worker attendance
  markAttendance: async (attendanceId: string, workerId: string): Promise<void> => {
    await attendanceApi.put(`/api/attendance/${attendanceId}/worker/${workerId}/markAttendance`);
  },

  // Get attendance by job ID
  getByJobId: async (jobId: string): Promise<AttendanceResponse[]> => {
    const response = await attendanceApi.get<AttendanceResponse[]>(`/api/attendance/job/${jobId}`);
    return response.data;
  },

  // Get attendance by worker ID
  getByWorkerId: async (workerId: string): Promise<AttendanceResponse[]> => {
    const response = await attendanceApi.get<AttendanceResponse[]>(`/api/attendance/worker/${workerId}`);
    return response.data;
  },

  // Check if attendance is marked
  isAttendanceMarked: async (assignmentId: string): Promise<boolean> => {
    const response = await attendanceApi.get<boolean>(`/api/attendance/check/${assignmentId}`);
    return response.data;
  },
};
