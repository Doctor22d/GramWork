export interface GeocodeResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    village?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export const geocodingService = {
  searchAddress: async (query: string): Promise<GeocodeResult[]> => {
    if (!query || query.length < 3) return [];
    
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '5',
    });

    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'GramWork-App/1.0' // Required by Nominatim policy
      }
    });
    
    if (!response.ok) throw new Error('Geocoding failed');
    return response.json();
  },

  reverseGeocode: async (lat: number, lng: number): Promise<GeocodeResult> => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: 'json',
      addressdetails: '1',
    });

    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'GramWork-App/1.0'
      }
    });

    if (!response.ok) throw new Error('Reverse geocoding failed');
    return response.json();
  }
};
