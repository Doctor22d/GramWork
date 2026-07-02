import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG } from '@/config/constants';
import { WorkerProfile } from '@/types';
import { geoJsonToLatLng } from '@/utils';

interface NearbyWorkersMapProps {
  centerLat: number;
  centerLng: number;
  workers: WorkerProfile[];
  radius?: number; // in kilometers
}

const workerIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const jobIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const NearbyWorkersMap: React.FC<NearbyWorkersMapProps> = ({
  centerLat,
  centerLng,
  workers,
  radius = 10,
}) => {
  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution={MAP_CONFIG.ATTRIBUTION}
          url={MAP_CONFIG.TILE_URL}
        />
        
        {/* Job location marker */}
        <Marker position={[centerLat, centerLng]} icon={jobIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold">Job Location</p>
            </div>
          </Popup>
        </Marker>

        {/* Search radius circle */}
        <Circle
          center={[centerLat, centerLng]}
          radius={radius * 1000} // Convert km to meters
          pathOptions={{
            color: 'blue',
            fillColor: 'blue',
            fillOpacity: 0.1,
          }}
        />

        {/* Worker markers */}
        {workers.map((worker) => {
          const [lat, lng] = geoJsonToLatLng(worker.location);
          return (
            <Marker key={worker.userId} position={[lat, lng]} icon={workerIcon}>
              <Popup>
                <div className="min-w-[200px]">
                  <p className="font-semibold">{worker.name}</p>
                  <p className="text-sm text-muted-foreground">{worker.skill}</p>
                  <div className="mt-2 space-y-1 text-xs">
                    <p>Experience: {worker.yearsOfExperience} years</p>
                    <p>Wage: ₹{worker.dailyWage}/day</p>
                    <p>Rating: {worker.rating}/5 ⭐</p>
                    <p className="capitalize">Status: {worker.availability}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default NearbyWorkersMap;
