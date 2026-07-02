'use client';

import { useEffect, useCallback } from 'react';
import { useLocationStore } from '../store/useLocationStore';
import { locationService } from '../api/locationService';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { toast } from 'sonner';

const SYNC_INTERVAL_MS = 20 * 60 * 1000; // 20 minutes

export function useGeolocation() {
  const { user } = useAuthStore();
  const { 
    latitude, longitude, setLocation, 
    permissionState, setPermissionState, 
    autoUpdateEnabled, lastUpdated
  } = useLocationStore();

  const syncToBackend = useCallback(async (lat: number, lng: number) => {
    if (!user?.id) return;
    try {
      await locationService.updateWorkerLocation(user.id, lat, lng);
    } catch (e) {
      console.error('Failed to sync location to backend', e);
    }
  }, [user]);

  const requestLocation = useCallback((silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng, accuracy } = position.coords;
        setLocation(lat, lng, accuracy);
        setPermissionState('granted');
        syncToBackend(lat, lng);
        if (!silent) toast.success('Location updated successfully');
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionState('denied');
          if (!silent) toast.error('Location permission was denied. Please use manual fallback.');
        } else {
          if (!silent) toast.error('Failed to acquire location');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [setLocation, setPermissionState, syncToBackend]);

  // Check permissions on mount
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        setPermissionState(status.state);
        status.onchange = () => {
          setPermissionState(status.state);
        };
      });
    }
  }, [setPermissionState]);

  // Polling for updates if granted and enabled
  useEffect(() => {
    if (permissionState === 'granted' && autoUpdateEnabled) {
      const interval = setInterval(() => {
        requestLocation(true);
      }, SYNC_INTERVAL_MS);
      
      return () => clearInterval(interval);
    }
  }, [permissionState, autoUpdateEnabled, requestLocation]);

  return {
    latitude,
    longitude,
    permissionState,
    autoUpdateEnabled,
    lastUpdated,
    requestLocation
  };
}
