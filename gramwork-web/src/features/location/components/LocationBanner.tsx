'use client';

import { useGeolocation } from '../hooks/useGeolocation';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { MapPin, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function LocationBanner() {
  const { permissionState, requestLocation, lastUpdated, autoUpdateEnabled } = useGeolocation();

  if (permissionState === 'denied') {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Location Access Denied</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <span>We need your location to show you nearby jobs and calculate distances accurately. Please enable location permissions in your browser settings.</span>
          <Button variant="outline" size="sm" className="w-fit" onClick={() => requestLocation()}>
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (permissionState === 'prompt') {
    return (
      <Alert className="mb-6 bg-primary/5 border-primary/20">
        <MapPin className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Enable Location Services</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span>Allow GramWork to access your location so we can instantly match you with assignments within your service area.</span>
          <Button size="sm" onClick={() => requestLocation()}>
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Granted state
  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg mb-6 border text-sm">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-green-600" />
        <span className="font-medium">Location Active</span>
        {lastUpdated && (
          <span className="text-muted-foreground hidden sm:inline">
            • Updated {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {!autoUpdateEnabled && (
          <span className="text-xs text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">Auto-sync disabled</span>
        )}
        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => requestLocation()}>
          Update Now
        </Button>
      </div>
    </div>
  );
}
