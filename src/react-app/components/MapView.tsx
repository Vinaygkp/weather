import { useEffect, useRef, useCallback } from 'react';
import { Map, Navigation } from 'lucide-react';
import type { LocationType } from '@/shared/types';

interface MapViewProps {
  location: LocationType | null;
  loading: boolean;
}

// Custom map component using vanilla Leaflet
export default function MapView({ location, loading }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const initializeMap = useCallback(async () => {
    if (!mapRef.current || !location?.lat || !location?.lon) return;
    
    try {
      // Dynamically import Leaflet
      const L = await import('leaflet');
      
      // Import CSS
      await import('leaflet/dist/leaflet.css');
      
      // Fix default markers
      const markerIcon = (await import('leaflet/dist/images/marker-icon.png')).default;
      const markerIcon2x = (await import('leaflet/dist/images/marker-icon-2x.png')).default;
      const markerShadow = (await import('leaflet/dist/images/marker-shadow.png')).default;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
      });

      // Clear existing map
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      // Create new map
      leafletMapRef.current = L.map(mapRef.current).setView([location.lat, location.lon], 12);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMapRef.current);

      // Add marker
      markerRef.current = L.marker([location.lat, location.lon])
        .addTo(leafletMapRef.current)
        .bindPopup(`
          <div style="text-align: center; padding: 8px;">
            <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #374151;">${location.name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #6B7280;">${location.country}</p>
            <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
              ${location.lat.toFixed(4)}°, ${location.lon.toFixed(4)}°
            </p>
          </div>
        `);

    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }, [location]);

  const updateMapView = useCallback(async () => {
    if (!leafletMapRef.current || !location?.lat || !location?.lon) return;
    
    try {
      // Animate to new location
      leafletMapRef.current.setView([location.lat, location.lon], 12, {
        animate: true,
        duration: 1.5,
      });

      // Update marker
      if (markerRef.current) {
        markerRef.current.setLatLng([location.lat, location.lon]);
        markerRef.current.setPopupContent(`
          <div style="text-align: center; padding: 8px;">
            <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #374151;">${location.name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #6B7280;">${location.country}</p>
            <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
              ${location.lat.toFixed(4)}°, ${location.lon.toFixed(4)}°
            </p>
          </div>
        `);
      }
    } catch (error) {
      console.error('Failed to update map view:', error);
    }
  }, [location]);

  // Initialize map on first render
  useEffect(() => {
    if (location?.lat && location?.lon && !leafletMapRef.current) {
      initializeMap();
    }
  }, [location, initializeMap]);

  // Update map when location changes
  useEffect(() => {
    if (location?.lat && location?.lon && leafletMapRef.current) {
      updateMapView();
    }
  }, [location, updateMapView]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl"></div>
            <div className="h-6 w-24 bg-white/20 rounded"></div>
          </div>
          <div className="h-48 bg-white/20 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!location || !location.lat || !location.lon) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="text-center">
          <Map className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Map unavailable</p>
          <p className="text-sm opacity-80">Unable to load map for this location</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Map className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold">Location Map</h3>
        <div className="ml-auto flex items-center gap-2 text-sm opacity-90">
          <Navigation className="w-4 h-4" />
          <span>{location.lat.toFixed(4)}°, {location.lon.toFixed(4)}°</span>
        </div>
      </div>

      <div 
        ref={mapRef}
        className="relative rounded-xl overflow-hidden shadow-lg bg-gray-100"
        style={{ height: '300px', width: '100%' }}
      >
        {!leafletMapRef.current && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm opacity-90">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm opacity-90">
        <span>Click and drag to explore the area</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Your location</span>
        </div>
      </div>
    </div>
  );
}
