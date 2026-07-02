import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/api';
import { QUERY_KEYS } from '@/config/constants';
import { NotificationEvent } from '@/types';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Get all notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS],
    queryFn: notificationService.getAllNotifications,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Send test notification
  const sendTestNotificationMutation = useMutation({
    mutationFn: notificationService.sendTestNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });

  return {
    notifications,
    isLoading,
    sendTestNotificationMutation,
  };
};
