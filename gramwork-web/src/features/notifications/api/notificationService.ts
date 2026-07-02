import api from '@/shared/api/axios';
import { components } from '@/shared/api/generated/notification';

export type NotificationEntity = components["schemas"]["NotificationEntity"];
export type NotificationEvent = components["schemas"]["NotificationEvent"];

export const notificationService = {
  getAllNotifications: async () => {
    const response = await api.get('/api/notifications/all');
    return response.data as NotificationEntity[];
  },

  // Fallback endpoint signatures if backend implements them
  markAsRead: async (id: string) => {
    const response = await api.put(`/api/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/api/notifications/read-all');
    return response.data;
  }
};
