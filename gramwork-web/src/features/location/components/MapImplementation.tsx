'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapController({ center, radius }: { center: [number, number], radius: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
    // Fit bounds to circle if desired, but setView is usually enough
  }, [center, map]);
  return null;
}

export default function MapImplementation({ 
  lat, 
  lng, 
  radiusKm 
}: { 
  lat: number; 
  lng: number; 
  radiusKm: number;
}) {
  const position: [number, number] = [lat, lng];

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      scrollWheelZoom={false} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} />
      <Circle 
        center={position} 
        radius={radiusKm * 1000} 
        pathOptions={{ color: 'hsl(var(--primary))', fillColor: 'hsl(var(--primary))', fillOpacity: 0.1 }} 
      />
      <MapController center={position} radius={radiusKm * 1000} />
    </MapContainer>
  );
}
