import { MessageType } from './enums';

// Notification Entity
export interface NotificationEntity {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  category: string;
  imageUrl?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Notification Event (for WebSocket)
export interface NotificationEvent {
  recipientId: string;
  email?: string;
  body: string;
  messageType: MessageType;
  subject: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  category?: string;
  actionUrl?: string;
  imageUrl?: string;
}
