import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG } from '@/config/constants';

interface JobLocationMapProps {
  latitude: number;
  longitude: number;
  jobTitle?: string;
  zoom?: number;
}

// Fix for default marker icon in React Leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const JobLocationMap: React.FC<JobLocationMapProps> = ({
  latitude,
  longitude,
  jobTitle = 'Job Location',
  zoom = 13,
}) => {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution={MAP_CONFIG.ATTRIBUTION}
          url={MAP_CONFIG.TILE_URL}
        />
        <Marker position={[latitude, longitude]} icon={defaultIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold">{jobTitle}</p>
              <p className="text-sm text-muted-foreground">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default JobLocationMap;
