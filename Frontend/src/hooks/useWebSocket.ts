import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import { WS_URL } from '@/config/constants';
import { NotificationEvent } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';

export const useWebSocket = (userId: string | null | undefined) => {
  const clientRef = useRef<Client | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Create WebSocket client
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      onConnect: () => {
        console.log('WebSocket connected');

        // Subscribe to user-specific notifications
        client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
          try {
            const notification: NotificationEvent = JSON.parse(message.body);
            
            // Show toast notification
            toast.info(notification.subject, {
              description: notification.body,
            });

            // Invalidate notifications query to refetch
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        });

        // Subscribe to general topic notifications
        client.subscribe('/topic/notifications', (message) => {
          try {
            const notification: NotificationEvent = JSON.parse(message.body);
            
            toast.info(notification.subject, {
              description: notification.body,
            });

            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        });
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },

      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      },
    });

    client.activate();
    clientRef.current = client;

    // Cleanup on unmount
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [userId, queryClient]);

  return clientRef.current;
};
