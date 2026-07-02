'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { formatDistance } from '@/features/location/utils/haversine';

// Icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const workerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const employerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function RouteController({ points }: { points: L.LatLngExpression[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [points, map]);
  return null;
}

export default function RouteMapImpl({
  workerLat, workerLng,
  employerLat, employerLng,
  serviceRadiusKm,
  distanceKm
}: {
  workerLat: number; workerLng: number;
  employerLat: number; employerLng: number;
  serviceRadiusKm: number;
  distanceKm: number;
}) {
  const workerPos: [number, number] = [workerLat, workerLng];
  const employerPos: [number, number] = [employerLat, employerLng];
  const routePoints = [workerPos, employerPos];

  return (
    <MapContainer 
      zoom={13} 
      scrollWheelZoom={true} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Worker Location & Service Area */}
      <Marker position={workerPos} icon={workerIcon}>
        <Popup>Your Location</Popup>
      </Marker>
      <Circle 
        center={workerPos} 
        radius={serviceRadiusKm * 1000} 
        pathOptions={{ color: 'hsl(var(--primary))', fillColor: 'hsl(var(--primary))', fillOpacity: 0.1 }} 
      />

      {/* Employer Location */}
      <Marker position={employerPos} icon={employerIcon}>
        <Popup>Assignment Location</Popup>
      </Marker>

      {/* Route Visualization */}
      <Polyline 
        positions={routePoints} 
        pathOptions={{ color: 'hsl(var(--primary))', dashArray: '10, 10', weight: 4, opacity: 0.7 }} 
      >
        <Popup className="text-center font-semibold">
          Distance: {formatDistance(distanceKm)}
        </Popup>
      </Polyline>

      <RouteController points={routePoints} />
    </MapContainer>
  );
}
