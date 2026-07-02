import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type PermissionState = 'prompt' | 'granted' | 'denied';

interface LocationStore {
  // Geolocation
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  lastUpdated: string | null;
  
  // Settings
  permissionState: PermissionState;
  serviceRadiusKm: number; // Geofencing radius
  autoUpdateEnabled: boolean;

  // Actions
  setLocation: (lat: number, lng: number, acc: number) => void;
  setPermissionState: (state: PermissionState) => void;
  setServiceRadius: (radius: number) => void;
  setAutoUpdate: (enabled: boolean) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      latitude: null,
      longitude: null,
      accuracy: null,
      lastUpdated: null,

      permissionState: 'prompt',
      serviceRadiusKm: 5, // Default 5km
      autoUpdateEnabled: true,

      setLocation: (lat, lng, acc) => set({
        latitude: lat,
        longitude: lng,
        accuracy: acc,
        lastUpdated: new Date().toISOString()
      }),
      setPermissionState: (state) => set({ permissionState: state }),
      setServiceRadius: (radius) => set({ serviceRadiusKm: radius }),
      setAutoUpdate: (enabled) => set({ autoUpdateEnabled: enabled })
    }),
    {
      name: 'gramwork-location',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
