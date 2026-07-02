'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useLocationStore } from '@/features/location/store/useLocationStore';
import { calculateHaversineDistance, formatDistance } from '@/features/location/utils/haversine';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Map, List, MapPin } from 'lucide-react';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';

const MapImplementation = dynamic(() => import('./NearbyJobsMapImpl'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

// Mock jobs for UI presentation
const MOCK_JOBS = [
  { id: '1', title: 'Farm Harvest Laborer', wage: 450, latOffset: 0.01, lngOffset: 0.01 },
  { id: '2', title: 'Construction Helper', wage: 600, latOffset: -0.015, lngOffset: 0.02 },
  { id: '3', title: 'Painter required', wage: 500, latOffset: 0.05, lngOffset: -0.05 }, // Further away
  { id: '4', title: 'Loading/Unloading', wage: 400, latOffset: -0.005, lngOffset: -0.005 },
];

export function NearbyJobs() {
  const { latitude, longitude, serviceRadiusKm } = useLocationStore();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showOutsideRadius, setShowOutsideRadius] = useState(false);

  // Calculate actual distances for mock jobs
  const processedJobs = useMemo(() => {
    if (!latitude || !longitude) return [];
    return MOCK_JOBS.map(job => {
      const jobLat = latitude + job.latOffset;
      const jobLng = longitude + job.lngOffset;
      const distKm = calculateHaversineDistance(latitude, longitude, jobLat, jobLng);
      return { ...job, lat: jobLat, lng: jobLng, distKm };
    }).sort((a, b) => a.distKm - b.distKm);
  }, [latitude, longitude]);

  const visibleJobs = useMemo(() => {
    if (showOutsideRadius) return processedJobs;
    return processedJobs.filter(j => j.distKm <= serviceRadiusKm);
  }, [processedJobs, showOutsideRadius, serviceRadiusKm]);

  if (!latitude || !longitude) {
    return (
      <Card className="p-8 text-center bg-muted/20">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Location Required</h3>
        <p className="text-muted-foreground">Please enable location services to discover nearby jobs.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-3 rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="show-outside" checked={showOutsideRadius} onCheckedChange={setShowOutsideRadius} />
            <Label htmlFor="show-outside">Show jobs outside service radius ({serviceRadiusKm} km)</Label>
          </div>
        </div>
        
        <div className="flex items-center bg-background rounded-md border p-1">
          <Button 
            variant={viewMode === 'map' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setViewMode('map')}
            className="h-8"
          >
            <Map className="mr-2 h-4 w-4" /> Map
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setViewMode('list')}
            className="h-8"
          >
            <List className="mr-2 h-4 w-4" /> List
          </Button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="h-[600px] rounded-lg overflow-hidden border relative z-0 shadow-sm">
          <MapImplementation 
            workerLat={latitude} 
            workerLng={longitude} 
            radiusKm={serviceRadiusKm} 
            jobs={visibleJobs} 
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleJobs.length === 0 ? (
            <div className="col-span-full p-8 text-center text-muted-foreground">
              No jobs found matching your criteria.
            </div>
          ) : (
            visibleJobs.map(job => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600 mb-4">₹{job.wage} <span className="text-sm font-normal text-muted-foreground">/ day</span></p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      {formatDistance(job.distKm)}
                    </span>
                    <Button size="sm" variant={job.distKm <= serviceRadiusKm ? "default" : "outline"}>
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
