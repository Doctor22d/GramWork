'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/shared/components/ui/button';
import { formatDistance } from '@/features/location/utils/haversine';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons for differentiation
const workerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapController({ center, radius }: { center: [number, number], radius: number }) {
  const map = useMap();
  useEffect(() => {
    // Fit bounds automatically to the service radius
    const circle = L.circle(center, { radius });
    map.fitBounds(circle.getBounds(), { padding: [50, 50] });
  }, [center, radius, map]);
  return null;
}

export default function NearbyJobsMapImpl({
  workerLat,
  workerLng,
  radiusKm,
  jobs
}: {
  workerLat: number;
  workerLng: number;
  radiusKm: number;
  jobs: Array<{id: string, lat: number, lng: number, title: string, wage: number, distKm: number}>;
}) {
  const position: [number, number] = [workerLat, workerLng];

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      scrollWheelZoom={true} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Worker Location & Service Area */}
      <Marker position={position} icon={workerIcon}>
        <Popup>
          <strong>Your Location</strong><br/>
          Service Radius: {radiusKm} km
        </Popup>
      </Marker>
      <Circle 
        center={position} 
        radius={radiusKm * 1000} 
        pathOptions={{ color: 'hsl(var(--primary))', fillColor: 'hsl(var(--primary))', fillOpacity: 0.1 }} 
      />

      {/* Clustered Job Markers */}
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={50}
        spiderfyOnMaxZoom={true}
      >
        {jobs.map(job => (
          <Marker key={job.id} position={[job.lat, job.lng]}>
            <Popup>
              <div className="text-sm min-w-[150px]">
                <h4 className="font-bold">{job.title}</h4>
                <p className="text-green-600 font-semibold mb-2">₹{job.wage} / day</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-muted-foreground text-xs">{formatDistance(job.distKm)}</span>
                  <Button size="sm" className="h-7 text-xs" asChild>
                    <a href={`/worker/assignments/${job.id}`}>View Details</a>
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      
      <MapController center={position} radius={radiusKm * 1000} />
    </MapContainer>
  );
}
