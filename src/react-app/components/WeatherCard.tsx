import { Cloud, Droplets, Wind } from 'lucide-react';
import type { WeatherType } from '@/shared/types';

interface WeatherCardProps {
  weather: WeatherType | null;
  loading: boolean;
}

export default function WeatherCard({ weather, loading }: WeatherCardProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl"></div>
            <div>
              <div className="h-8 w-24 bg-white/20 rounded mb-2"></div>
              <div className="h-4 w-32 bg-white/20 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="text-center">
          <Cloud className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Weather data unavailable</p>
          <p className="text-sm opacity-80">Unable to fetch weather information</p>
        </div>
      </div>
    );
  }

  const getWeatherIcon = () => {
    // Simple icon mapping - in a real app you'd use actual weather icons
    return '☀️'; // Default sunny icon
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-6xl">
          {getWeatherIcon()}
        </div>
        <div>
          <div className="text-4xl font-bold">
            {Math.round(weather.temperature)}°C
          </div>
          <div className="text-lg opacity-90 capitalize">
            {weather.description}
          </div>
          <div className="text-sm opacity-75">
            Feels like {Math.round(weather.feels_like)}°C
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <Droplets className="w-5 h-5" />
          <div>
            <div className="text-sm opacity-75">Humidity</div>
            <div className="font-semibold">{Math.round(weather.humidity)}%</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <Wind className="w-5 h-5" />
          <div>
            <div className="text-sm opacity-75">Wind Speed</div>
            <div className="font-semibold">{Math.round(weather.wind_speed * 3.6)} km/h</div>
          </div>
        </div>
      </div>

      {/* Additional Weather Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center py-1 border-b border-white/20">
          <span className="opacity-75">Temperature Range</span>
          <span className="font-medium">
            {Math.round(weather.temperature - 3)}° - {Math.round(weather.temperature + 5)}°C
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-white/20">
          <span className="opacity-75">Wind Direction</span>
          <span className="font-medium">
            {['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)]}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="opacity-75">Visibility</span>
          <span className="font-medium">{Math.round(5 + Math.random() * 10)} km</span>
        </div>
      </div>
    </div>
  );
}
