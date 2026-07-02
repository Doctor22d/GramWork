'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocationStore } from '../store/useLocationStore';
import { Card } from '@/shared/components/ui/card';

// Leaflet relies heavily on window, so we dynamic import the actual map
const MapImplementation = dynamic(() => import('./MapImplementation'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

export function LeafletMap() {
  const { latitude, longitude, serviceRadiusKm } = useLocationStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!latitude || !longitude) {
    return (
      <Card className="h-[400px] flex items-center justify-center text-muted-foreground bg-muted/20">
        Map unavailable. Please enable location services.
      </Card>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border h-[400px] relative z-0">
      <MapImplementation 
        lat={latitude} 
        lng={longitude} 
        radiusKm={serviceRadiusKm} 
      />
    </div>
  );
}
