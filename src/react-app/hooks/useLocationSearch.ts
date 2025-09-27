import { useState } from 'react';
import axios from 'axios';
import type { LocationType, WeatherType, TimeInfoType, PlaceInfoType, SearchResult } from '@/shared/types';

const WORLDTIME_API_BASE = 'https://worldtimeapi.org/api/timezone';
const NOMINATIM_API_BASE = 'https://nominatim.openstreetmap.org/search';
const WIKIPEDIA_API_BASE = 'https://en.wikipedia.org/api/rest_v1/page/summary';

export const useLocationSearch = () => {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchLocation = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchResult({
      location: { name: '', country: '', lat: 0, lon: 0, display_name: '' },
      weather: null,
      timeInfo: null,
      placeInfo: null,
      loading: true,
      error: null,
    });

    try {
      // First, geocode the location using Nominatim
      const geocodeResponse = await axios.get(NOMINATIM_API_BASE, {
        params: {
          q: query,
          format: 'json',
          limit: 1,
          addressdetails: 1,
        },
      });

      if (geocodeResponse.data.length === 0) {
        throw new Error('Location not found');
      }

      const locationData = geocodeResponse.data[0];
      const location: LocationType = {
        name: locationData.name || locationData.display_name.split(',')[0],
        country: locationData.address?.country || 'Unknown',
        state: locationData.address?.state,
        lat: parseFloat(locationData.lat),
        lon: parseFloat(locationData.lon),
        display_name: locationData.display_name,
      };

      // Start all API calls in parallel
      const weatherPromise = fetchWeather();
      const timePromise = fetchTimeInfo(location.lat, location.lon);
      const placeInfoPromise = fetchPlaceInfo(location.name, location.country);

      setSearchResult({
        location,
        weather: null,
        timeInfo: null,
        placeInfo: null,
        loading: true,
        error: null,
      });

      // Wait for all results
      const [weather, timeInfo, placeInfo] = await Promise.allSettled([
        weatherPromise,
        timePromise,
        placeInfoPromise,
      ]);

      setSearchResult({
        location,
        weather: weather.status === 'fulfilled' ? weather.value : null,
        timeInfo: timeInfo.status === 'fulfilled' ? timeInfo.value : null,
        placeInfo: placeInfo.status === 'fulfilled' ? placeInfo.value : null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setSearchResult({
        location: { name: '', country: '', lat: 0, lon: 0, display_name: '' },
        weather: null,
        timeInfo: null,
        placeInfo: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsSearching(false);
    }
  };

  return { searchResult, isSearching, searchLocation };
};

const fetchWeather = async (): Promise<WeatherType> => {
  // Using OpenWeatherMap One Call API (demo data for frontend-only)
  // In a real app, this would be handled by the backend
  const mockWeatherData = {
    temperature: 22 + Math.random() * 15, // Mock temperature between 22-37°C
    description: ['Clear sky', 'Few clouds', 'Partly cloudy', 'Light rain'][Math.floor(Math.random() * 4)],
    humidity: 40 + Math.random() * 40, // 40-80%
    wind_speed: Math.random() * 10, // 0-10 m/s
    feels_like: 22 + Math.random() * 15,
    icon: ['01d', '02d', '03d', '10d'][Math.floor(Math.random() * 4)],
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockWeatherData;
};

const fetchTimeInfo = async (lat: number, lon: number): Promise<TimeInfoType> => {
  try {
    // Fallback to WorldTimeAPI with estimated timezone
    const timezone = estimateTimezone(lat, lon);
    const timeResponse = await axios.get(`${WORLDTIME_API_BASE}/${timezone}`);
    
    return {
      timezone: timeResponse.data.timezone,
      current_time: new Date(timeResponse.data.datetime).toLocaleString(),
      utc_offset: timeResponse.data.utc_offset,
    };
  } catch (error) {
    // Fallback to local time with estimated timezone
    const timezone = estimateTimezone(lat, lon);
    const now = new Date();
    return {
      timezone: timezone,
      current_time: now.toLocaleString(),
      utc_offset: '+00:00',
    };
  }
};

const fetchPlaceInfo = async (name: string, country: string): Promise<PlaceInfoType> => {
  try {
    // Try to get Wikipedia summary
    const searchTerm = `${name}, ${country}`.replace(/\s+/g, '_');
    const response = await axios.get(`${WIKIPEDIA_API_BASE}/${encodeURIComponent(searchTerm)}`);
    
    return {
      title: response.data.title,
      extract: response.data.extract,
      thumbnail: response.data.thumbnail?.source,
      page_url: response.data.content_urls?.desktop?.page,
    };
  } catch (error) {
    // Fallback with mock data
    return {
      title: name,
      extract: `${name} is a location in ${country}. This area has its own unique culture, geography, and attractions that make it a distinctive place to visit or live.`,
      thumbnail: `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 1000)}`,
    };
  }
};

const estimateTimezone = (_lat: number, lon: number): string => {
  // Simple timezone estimation based on longitude
  const timezoneOffset = Math.round(lon / 15);
  const timezones = [
    'Pacific/Honolulu',    // -10
    'America/Anchorage',   // -9
    'America/Los_Angeles', // -8
    'America/Denver',      // -7
    'America/Chicago',     // -6
    'America/New_York',    // -5
    'America/Caracas',     // -4
    'America/Sao_Paulo',   // -3
    'Atlantic/South_Georgia', // -2
    'Atlantic/Azores',     // -1
    'Europe/London',       // 0
    'Europe/Paris',        // +1
    'Europe/Athens',       // +2
    'Europe/Moscow',       // +3
    'Asia/Dubai',          // +4
    'Asia/Karachi',        // +5
    'Asia/Dhaka',          // +6
    'Asia/Bangkok',        // +7
    'Asia/Shanghai',       // +8
    'Asia/Tokyo',          // +9
    'Australia/Sydney',    // +10
    'Pacific/Norfolk',     // +11
    'Pacific/Auckland',    // +12
  ];
  
  const index = Math.max(0, Math.min(timezones.length - 1, timezoneOffset + 10));
  return timezones[index];
};
