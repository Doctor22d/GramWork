import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useNotificationStore } from '../store/useNotificationStore';
import { NotificationEntity } from './notificationService';
import { toast } from 'sonner';

class WebSocketClient {
  private client: Client | null = null;
  private onMessageCallback: ((message: NotificationEntity) => void) | null = null;
  private token: string | null = null;

  public initialize(token: string, onMessage: (msg: NotificationEntity) => void) {
    this.token = token;
    this.onMessageCallback = onMessage;
    this.connect();
  }

  private connect() {
    if (this.client?.active) return;

    useNotificationStore.getState().setConnectionState('CONNECTING');

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8088/ws';

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
      debug: (str) => {
        // Observability: Log STOMP lifecycle events but avoid sensitive data
        if (str.includes('CONNECT') || str.includes('SUBSCRIBE') || str.includes('DISCONNECT')) {
          console.info(`[NotificationService] Lifecycle Event: ${str}`);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.info('[NotificationService] Connected successfully');
      const prevState = useNotificationStore.getState().connectionState;
      if (prevState === 'CONNECTING' || prevState === 'DISCONNECTED') {
        // Only toast if we were previously offline or connecting
        toast.success('Connected to real-time notification service');
      }
      useNotificationStore.getState().setConnectionState('CONNECTED');
      
      // Subscribe to user specific destination
      this.client?.subscribe('/user/queue/notifications', (message: IMessage) => {
        if (message.body) {
          try {
            const parsed: NotificationEntity = JSON.parse(message.body);
            // Log non-sensitive metadata for observability
            console.info(`[NotificationService] Received message ID: ${parsed.id}, Category: ${parsed.category}`);
            if (this.onMessageCallback) {
              this.onMessageCallback(parsed);
            }
          } catch (e) {
            console.error('[NotificationService] Failed to parse WebSocket message', e);
          }
        }
      });
    };

    this.client.onDisconnect = () => {
      console.info('[NotificationService] Disconnected');
      useNotificationStore.getState().setConnectionState('DISCONNECTED');
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      toast.error('Notification service disconnected. Retrying...');
    };

    this.client.activate();
  }

  public disconnect() {
    if (this.client?.active) {
      this.client.deactivate();
      this.client = null;
      useNotificationStore.getState().setConnectionState('DISCONNECTED');
    }
  }
}

export const wsClient = new WebSocketClient();
