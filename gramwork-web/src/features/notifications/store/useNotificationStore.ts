import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';

export interface NotificationPreferences {
  toastsEnabled: boolean;
  soundEnabled: boolean;
  categories: {
    system: boolean;
    assignments: boolean;
    jobs: boolean;
    payments: boolean;
  };
}

interface NotificationStore {
  connectionState: ConnectionState;
  setConnectionState: (state: ConnectionState) => void;
  
  // Real-time unread management
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
  clearUnread: () => void;

  // Preferences
  preferences: NotificationPreferences;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  
  // Observability
  lastNotificationTimestamp: string | null;
  setLastNotificationTimestamp: (timestamp: string) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      connectionState: 'DISCONNECTED',
      setConnectionState: (state) => set({ connectionState: state }),
      
      unreadCount: 0,
      setUnreadCount: (count) => set({ unreadCount: count }),
      incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
      decrementUnread: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
      clearUnread: () => set({ unreadCount: 0 }),

      preferences: {
        toastsEnabled: true,
        soundEnabled: true,
        categories: {
          system: true,
          assignments: true,
          jobs: true,
          payments: true,
        }
      },
      updatePreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs }
      })),

      lastNotificationTimestamp: null,
      setLastNotificationTimestamp: (timestamp) => set({ lastNotificationTimestamp: timestamp }),
    }),
    {
      name: 'gramwork-notification-prefs',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ preferences: state.preferences }), // Only persist preferences
    }
  )
);
