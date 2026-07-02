import { format, parseISO } from 'date-fns';
import { DATE_FORMATS } from '@/config/constants';

/**
 * Format currency in INR
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date from ISO string
 */
export const formatDate = (dateString: string, formatString: string = DATE_FORMATS.DISPLAY): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone || phone.length !== 10) return phone;
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
};

/**
 * Format Aadhaar number for display
 */
export const formatAadhaar = (aadhaar: string): string => {
  if (!aadhaar || aadhaar.length !== 12) return aadhaar;
  return `${aadhaar.slice(0, 4)} ${aadhaar.slice(4, 8)} ${aadhaar.slice(8)}`;
};

/**
 * Calculate distance between two coordinates (in km)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceInKm: number): string => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  }
  return `${distanceInKm.toFixed(1)} km`;
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Convert GeoJsonPoint to [lat, lng] format for Leaflet
 */
export const geoJsonToLatLng = (geoJson: { coordinates: [number, number] }): [number, number] => {
  // GeoJSON is [longitude, latitude], Leaflet expects [latitude, longitude]
  return [geoJson.coordinates[1], geoJson.coordinates[0]];
};

/**
 * Convert [lat, lng] to GeoJson coordinates
 */
export const latLngToGeoJson = (lat: number, lng: number): [number, number] => {
  // Return as [longitude, latitude] for GeoJSON
  return [lng, lat];
};
