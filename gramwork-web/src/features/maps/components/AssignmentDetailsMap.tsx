'use client';

import dynamic from 'next/dynamic';
import { useLocationStore } from '@/features/location/store/useLocationStore';
import { calculateHaversineDistance, formatDistance } from '@/features/location/utils/haversine';
import { Card, CardContent } from '@/shared/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

const MapImplementation = dynamic(() => import('./RouteMapImpl'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading Route...</div>
});

export function AssignmentDetailsMap({ 
  assignmentLat, 
  assignmentLng,
  address
}: { 
  assignmentLat: number; 
  assignmentLng: number;
  address?: string;
}) {
  const { latitude, longitude, serviceRadiusKm } = useLocationStore();

  if (!latitude || !longitude) {
    return (
      <Card className="p-6 text-center bg-muted/20">
        <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Location services required to calculate route.</p>
      </Card>
    );
  }

  const distanceKm = calculateHaversineDistance(latitude, longitude, assignmentLat, assignmentLng);
  const isInsideGeofence = distanceKm <= serviceRadiusKm;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-muted/30 border rounded-lg">
        <div>
          <h4 className="font-semibold flex items-center">
            <Navigation className="h-4 w-4 mr-2 text-primary" />
            Route Information
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {address || 'Assignment Coordinates Provided'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 text-right">
          <div className="text-xl font-bold">{formatDistance(distanceKm)}</div>
          <div className={`text-xs font-semibold px-2 py-1 rounded inline-block mt-1 ${isInsideGeofence ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'}`}>
            {isInsideGeofence ? 'Within Service Area' : 'Outside Service Area'}
          </div>
        </div>
      </div>

      <div className="h-[400px] rounded-lg overflow-hidden border relative z-0">
        <MapImplementation 
          workerLat={latitude}
          workerLng={longitude}
          employerLat={assignmentLat}
          employerLng={assignmentLng}
          serviceRadiusKm={serviceRadiusKm}
          distanceKm={distanceKm}
        />
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" asChild>
          <a href={`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${assignmentLat},${assignmentLng}`} target="_blank" rel="noreferrer">
            Get Directions
          </a>
        </Button>
      </div>
    </div>
  );
}
