import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, NotificationEntity } from '../api/notificationService';
import { wsClient } from '../api/websocketClient';
import { useNotificationStore } from '../store/useNotificationStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { toast } from 'sonner';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'];

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { token, isAuthenticated } = useAuthStore();
  const { setUnreadCount, incrementUnread, connectionState, setLastNotificationTimestamp } = useNotificationStore();

  const query = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      const data = await notificationService.getAllNotifications();
      // Calculate unread count initially
      const unread = data.filter(n => !n.read).length;
      setUnreadCount(unread);
      return data;
    },
    enabled: isAuthenticated && !!token,
  });

  useEffect(() => {
    if (isAuthenticated && token) {
      wsClient.initialize(token, (newNotification: NotificationEntity) => {
        // Observability
        setLastNotificationTimestamp(new Date().toISOString());

        // Optimistically update query cache
        queryClient.setQueryData<NotificationEntity[]>(NOTIFICATIONS_QUERY_KEY, (old) => {
          if (!old) return [newNotification];
          if (old.some(n => n.id === newNotification.id)) return old;
          return [newNotification, ...old];
        });
        
        incrementUnread();
        
        // Cache invalidation based on backend events (RabbitMQ categories)
        const category = newNotification.category?.toLowerCase() || '';
        
        if (category.includes('job') || category === 'nearby-jobs') {
          queryClient.invalidateQueries({ queryKey: ['jobs'] });
        }
        if (category.includes('assignment')) {
          queryClient.invalidateQueries({ queryKey: ['assignments'] });
        }
        if (category.includes('payment')) {
          queryClient.invalidateQueries({ queryKey: ['payments'] });
        }

        // Check user preferences before showing Toasts
        const freshPreferences = useNotificationStore.getState().preferences;
        if (freshPreferences.toastsEnabled) {
          let shouldShow = true;
          
          if (category.includes('job') && !freshPreferences.categories.jobs) shouldShow = false;
          if (category.includes('assignment') && !freshPreferences.categories.assignments) shouldShow = false;
          if (category.includes('payment') && !freshPreferences.categories.payments) shouldShow = false;
          if (category.includes('system') && !freshPreferences.categories.system) shouldShow = false;

          if (shouldShow) {
            toast(newNotification.title || 'New Notification', {
              description: newNotification.message,
              action: newNotification.actionUrl ? {
                label: 'View',
                onClick: () => window.location.href = newNotification.actionUrl!
              } : undefined
            });
          }
        }
      });
    }

    return () => {
      wsClient.disconnect();
    };
  }, [isAuthenticated, token, queryClient, incrementUnread]);

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: (_, variables) => {
      queryClient.setQueryData<NotificationEntity[]>(NOTIFICATIONS_QUERY_KEY, (old) => {
        if (!old) return [];
        return old.map(n => n.id === variables ? { ...n, read: true } : n);
      });
      useNotificationStore.getState().decrementUnread();
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData<NotificationEntity[]>(NOTIFICATIONS_QUERY_KEY, (old) => {
        if (!old) return [];
        return old.map(n => ({ ...n, read: true }));
      });
      useNotificationStore.getState().clearUnread();
    }
  });

  return {
    notifications: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    connectionState,
    unreadCount: useNotificationStore(state => state.unreadCount)
  };
};
