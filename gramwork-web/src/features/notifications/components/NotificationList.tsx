'use client';

import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { EmptyState } from '@/shared/components/layout/EmptyState';
import { ErrorState } from '@/shared/components/layout/ErrorState';

export function NotificationList() {
  const { notifications, isLoading, isError, error, markAsRead, markAllAsRead, refetch } = useNotifications();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-muted/50 rounded-t-xl" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState message={(error as Error).message} onRetry={() => refetch()} />;
  }

  if (notifications.length === 0) {
    return (
      <EmptyState 
        title="No notifications yet" 
        description="When you receive updates about jobs, assignments, or payments, they will appear here." 
      />
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Notifications</h2>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllAsRead()}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={!notification.read ? 'border-primary/50 bg-primary/5' : ''}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">
                  {notification.title}
                </CardTitle>
                <CardDescription>
                  {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : ''}
                </CardDescription>
              </div>
              {!notification.read && (
                <Button variant="ghost" size="icon" onClick={() => notification.id && markAsRead(notification.id)} title="Mark as read">
                  <Check className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">{notification.message}</p>
              {notification.actionUrl && (
                <Button variant="link" className="px-0 mt-2" asChild>
                  <a href={notification.actionUrl}>View Details</a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
