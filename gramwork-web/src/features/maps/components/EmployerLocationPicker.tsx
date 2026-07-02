'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import dynamic from 'next/dynamic';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { geocodingService, GeocodeResult } from '../api/geocodingService';
import { Card, CardContent } from '@/shared/components/ui/card';

const MapImplementation = dynamic(() => import('./EmployerLocationPickerImpl'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

export function EmployerLocationPicker({ 
  onSave 
}: { 
  onSave: (lat: number, lng: number, address: string) => void 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 800);
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, address: string} | null>(null);

  useEffect(() => {
    async function search() {
      if (!debouncedQuery || debouncedQuery.length < 3) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await geocodingService.searchAddress(debouncedQuery);
        setSearchResults(results);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }
    search();
  }, [debouncedQuery]);

  const handleSelectResult = (res: GeocodeResult) => {
    setSelectedLocation({
      lat: parseFloat(res.lat),
      lng: parseFloat(res.lon),
      address: res.display_name
    });
    setSearchResults([]);
    setSearchQuery(res.display_name);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search village, city, or PIN code..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        
        {searchResults.length > 0 && (
          <Card className="absolute z-50 w-full mt-1 max-h-[300px] overflow-y-auto">
            <CardContent className="p-2 space-y-1">
              {searchResults.map((res, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-2 p-2 hover:bg-muted rounded cursor-pointer text-sm"
                  onClick={() => handleSelectResult(res)}
                >
                  <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span className="line-clamp-2">{res.display_name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="h-[400px] rounded-lg overflow-hidden border relative z-0">
        <MapImplementation 
          initialLat={selectedLocation?.lat}
          initialLng={selectedLocation?.lng}
          onLocationSelect={(lat, lng, address) => {
            setSelectedLocation({ lat, lng, address });
          }} 
        />
      </div>

      <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
        <div className="text-sm">
          <p className="font-semibold">Selected Coordinates</p>
          <p className="text-muted-foreground">
            {selectedLocation ? `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}` : 'Drag pin to select'}
          </p>
        </div>
        <Button 
          disabled={!selectedLocation}
          onClick={() => selectedLocation && onSave(selectedLocation.lat, selectedLocation.lng, selectedLocation.address)}
        >
          Confirm Location
        </Button>
      </div>
    </div>
  );
}
