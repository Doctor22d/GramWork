import api from '@/shared/api/axios';
import type { AttendanceResponse } from '@/shared/types/models';

// =============================================================================
// Attendance Service (Port 8087) — proxied through Next.js rewrites
// =============================================================================

export const attendanceService = {
  /** Create attendance for an assignment. */
  createAttendance: async (assignmentId: string): Promise<AttendanceResponse> => {
    const response = await api.post(`/api/attendance/${assignmentId}/create`);
    return response.data;
  },

  /** Mark attendance for a worker. */
  markAttendance: async (attendanceId: string, workerId: string): Promise<AttendanceResponse> => {
    const response = await api.put(`/api/attendance/${attendanceId}/worker/${workerId}/markAttendance`);
    return response.data;
  },

  /** Get attendance records by job ID. */
  getByJob: async (jobId: string): Promise<AttendanceResponse[]> => {
    const response = await api.get(`/api/attendance/job/${jobId}`);
    return response.data;
  },

  /** Get attendance records by worker ID. */
  getByWorker: async (workerId: string): Promise<AttendanceResponse[]> => {
    const response = await api.get(`/api/attendance/worker/${workerId}`);
    return response.data;
  },

  /** Check if attendance is marked for an assignment. */
  isAttendanceMarked: async (assignmentId: string): Promise<boolean> => {
    const response = await api.get(`/api/attendance/check/${assignmentId}`);
    return response.data;
  },
};
