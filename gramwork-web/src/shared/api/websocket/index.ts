import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  private client: Client | null = null;
  private onConnectCallbacks: Array<() => void> = [];

  connect(token: string) {
    if (this.client && this.client.active) return;

    // WebSocket endpoint is on NotificationService (port 8088)
    const wsUrl = process.env.NEXT_PUBLIC_NOTIFICATION_URL || 'http://localhost:8088';

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${wsUrl}/ws-notifications`),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => console.log('STOMP Debug: ', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Connected to STOMP WebSocket Server');
        this.onConnectCallbacks.forEach(cb => cb());
        this.onConnectCallbacks = []; // Clear after running
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      onWebSocketError: (evt) => {
        console.error('WebSocket Error', evt);
      }
    });

    this.client.activate();
  }

  subscribeToNotifications(userId: string, callback: (message: unknown) => void) {
    const topic = `/user/queue/notifications`;

    const subscribeAction = () => {
      this.client?.subscribe(topic, (message) => {
        callback(JSON.parse(message.body));
      }, { id: `sub-${userId}` });
    };

    if (!this.client || !this.client.connected) {
      this.onConnectCallbacks.push(subscribeAction);
    } else {
      subscribeAction();
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }
}

export const wsService = new WebSocketService();
