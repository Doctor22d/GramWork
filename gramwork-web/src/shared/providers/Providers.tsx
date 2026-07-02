'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { wsService } from '@/shared/api/websocket';
import { toast } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));
  
  const { user, token } = useAuthStore();

  useEffect(() => {
    // Initialize WebSockets if the user is authenticated
    if (user && token) {
      wsService.connect(token);
      
      // Subscribe to user-specific notifications
      const userId = user.id || 'global';
      wsService.subscribeToNotifications(userId, (rawMessage: unknown) => {
        const message = rawMessage as Record<string, unknown>;
        toast.info((message?.title as string) || 'New Notification', {
          description: (message?.body as string) || (message?.message as string) || 'You have a new update.',
        });
        
        // Optionally invalidate certain queries when a notification arrives
        queryClient.invalidateQueries({ queryKey: ['assignments'] });
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
      });
      
    } else {
      wsService.disconnect();
    }
    
    return () => {
      wsService.disconnect();
    };
  }, [user, token, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
