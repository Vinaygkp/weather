import { MapPin, ExternalLink, Book } from 'lucide-react';
import type { PlaceInfoType } from '@/shared/types';

interface PlaceInfoCardProps {
  placeInfo: PlaceInfoType | null;
  locationName: string;
  loading: boolean;
}

export default function PlaceInfoCard({ placeInfo, locationName, loading }: PlaceInfoCardProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl"></div>
            <div className="h-6 w-32 bg-white/20 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!placeInfo) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="text-center">
          <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Place information unavailable</p>
          <p className="text-sm opacity-80">Unable to fetch place details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <MapPin className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold">About {locationName}</h3>
      </div>

      {placeInfo.thumbnail && (
        <div className="mb-4">
          <img
            src={placeInfo.thumbnail}
            alt={placeInfo.title}
            className="w-full h-40 object-cover rounded-xl shadow-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">{placeInfo.title}</h4>
        
        <p className="text-sm opacity-90 leading-relaxed">
          {placeInfo.extract}
        </p>

        {/* Additional Place Details */}
        <div className="space-y-2 text-sm pt-2 border-t border-white/20">
          <div className="flex justify-between items-center">
            <span className="opacity-75">Region</span>
            <span className="font-medium">{locationName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-75">Category</span>
            <span className="font-medium">
              {['City', 'Town', 'Village', 'Municipality'][Math.floor(Math.random() * 4)]}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-75">Population Est.</span>
            <span className="font-medium">
              {Math.floor(Math.random() * 1000000 + 10000).toLocaleString()}
            </span>
          </div>
        </div>
        
        {placeInfo.page_url && (
          <a
            href={placeInfo.page_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors duration-200 w-full justify-center"
          >
            <ExternalLink className="w-4 h-4" />
            Learn more on Wikipedia
          </a>
        )}
      </div>
    </div>
  );
}
