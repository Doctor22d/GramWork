import createAxiosInstance from './axiosInstance';
import { API_URLS } from '@/config/constants';
import { NotificationEntity, NotificationEvent } from '@/types';

const notificationApi = createAxiosInstance(API_URLS.NOTIFICATION);

export const notificationService = {
  // Get all notifications
  getAllNotifications: async (): Promise<NotificationEntity[]> => {
    const response = await notificationApi.get<NotificationEntity[]>('/api/notifications/all');
    return response.data;
  },

  // Send test notification
  sendTestNotification: async (event?: NotificationEvent): Promise<string> => {
    const response = await notificationApi.post<string>('/api/notifications/test', event);
    return response.data;
  },
};
