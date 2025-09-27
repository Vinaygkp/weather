import { Clock, Globe } from 'lucide-react';
import type { TimeInfoType } from '@/shared/types';

interface TimeCardProps {
  timeInfo: TimeInfoType | null;
  loading: boolean;
}

export default function TimeCard({ timeInfo, loading }: TimeCardProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl"></div>
            <div className="h-6 w-24 bg-white/20 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-8 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!timeInfo) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Time data unavailable</p>
          <p className="text-sm opacity-80">Unable to fetch time information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold">Local Time</h3>
      </div>

      <div className="space-y-4">
        <div className="text-3xl font-bold font-mono">
          {timeInfo.current_time}
        </div>
        
        <div className="flex items-center gap-2 text-sm opacity-90">
          <Globe className="w-4 h-4" />
          <span>{timeInfo.timezone.replace('_', ' ')}</span>
        </div>
        
        <div className="text-sm opacity-75">
          UTC {timeInfo.utc_offset}
        </div>

        {/* Additional Time Details */}
        <div className="space-y-2 text-sm pt-2 border-t border-white/20">
          <div className="flex justify-between items-center">
            <span className="opacity-75">Date</span>
            <span className="font-medium">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-75">Day of Year</span>
            <span className="font-medium">
              {Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-75">Week</span>
            <span className="font-medium">
              {Math.ceil(((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000 + new Date(new Date().getFullYear(), 0, 1).getDay() + 1) / 7)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
