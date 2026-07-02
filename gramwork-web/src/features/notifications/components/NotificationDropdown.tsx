'use client';

import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Bell, Wifi, WifiOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, connectionState } = useNotifications();
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase() || 'worker';

  const displayedNotifications = notifications.slice(0, 5);

  const getConnectionIcon = () => {
    switch (connectionState) {
      case 'CONNECTED': return <Wifi className="h-3 w-3 text-green-500" />;
      case 'CONNECTING': return <Loader2 className="h-3 w-3 text-yellow-500 animate-spin" />;
      case 'DISCONNECTED': return <WifiOff className="h-3 w-3 text-destructive" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <div className="flex items-center gap-2" title={connectionState}>
            {getConnectionIcon()}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {displayedNotifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        ) : (
          <div className="flex flex-col max-h-[300px] overflow-y-auto">
            {displayedNotifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notification.read ? 'bg-muted/50 font-medium' : ''}`}
                onClick={() => {
                  if (!notification.read && notification.id) {
                    markAsRead(notification.id);
                  }
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                  }
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold truncate">{notification.title}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : ''}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="ghost" className="w-full text-sm" asChild>
            <Link href={`/${role}/notifications`}>
              View all notifications
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
