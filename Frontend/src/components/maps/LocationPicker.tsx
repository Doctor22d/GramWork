import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG } from '@/config/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

const markerIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle map clicks
function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLat = MAP_CONFIG.DEFAULT_LAT,
  initialLng = MAP_CONFIG.DEFAULT_LNG,
  onLocationSelect,
}) => {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);

  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          onLocationSelect(pos.coords.latitude, pos.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please select manually on the map.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label>Latitude</Label>
          <Input
            type="number"
            step="any"
            value={position[0]}
            onChange={(e) => {
              const lat = parseFloat(e.target.value);
              if (!isNaN(lat)) {
                const newPos: [number, number] = [lat, position[1]];
                setPosition(newPos);
                onLocationSelect(lat, position[1]);
              }
            }}
          />
        </div>
        <div className="flex-1">
          <Label>Longitude</Label>
          <Input
            type="number"
            step="any"
            value={position[1]}
            onChange={(e) => {
              const lng = parseFloat(e.target.value);
              if (!isNaN(lng)) {
                const newPos: [number, number] = [position[0], lng];
                setPosition(newPos);
                onLocationSelect(position[0], lng);
              }
            }}
          />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGetCurrentLocation}
        className="w-full"
      >
        <MapPin className="h-4 w-4 mr-2" />
        Use Current Location
      </Button>

      <div className="h-[400px] w-full rounded-lg overflow-hidden border">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution={MAP_CONFIG.ATTRIBUTION}
            url={MAP_CONFIG.TILE_URL}
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      <p className="text-sm text-muted-foreground">
        Click on the map to select a location or use your current location
      </p>
    </div>
  );
};

export default LocationPicker;
