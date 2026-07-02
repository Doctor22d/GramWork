'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { geocodingService } from '../api/geocodingService';
import { toast } from 'sonner';

// Fix icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { animate: true });
  }, [center, map]);
  return null;
}

export default function EmployerLocationPickerImpl({
  initialLat = 20.5937,
  initialLng = 78.9629,
  onLocationSelect
}: {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [address, setAddress] = useState<string>('Drag the marker to select location');
  const markerRef = useRef<L.Marker>(null);

  const performReverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await geocodingService.reverseGeocode(lat, lng);
      setAddress(res.display_name);
      onLocationSelect(lat, lng, res.display_name);
    } catch (e) {
      setAddress('Unable to fetch address details');
      onLocationSelect(lat, lng, '');
    }
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          setPosition([latLng.lat, latLng.lng]);
          performReverseGeocode(latLng.lat, latLng.lng);
        }
      },
    }),
    []
  );

  return (
    <div className="relative h-full w-full">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={position} 
          draggable={true} 
          eventHandlers={eventHandlers}
          ref={markerRef}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold mb-1">Selected Location</p>
              <p className="text-muted-foreground">{address}</p>
            </div>
          </Popup>
        </Marker>
        <MapController center={position} />
      </MapContainer>
      <div className="absolute top-2 right-2 z-[400] bg-background/90 backdrop-blur p-2 rounded border shadow-sm max-w-[250px] text-xs pointer-events-none">
        {address}
      </div>
    </div>
  );
}
