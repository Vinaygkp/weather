import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export default function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-2xl opacity-75 blur group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center p-2">
              <div className="flex items-center justify-center w-12 h-12 text-gray-500">
                <MapPin className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for any city, state, or country..."
                className="flex-1 px-4 py-3 text-lg font-medium text-gray-700 bg-transparent border-none outline-none placeholder-gray-400"
                disabled={isSearching}
              />
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <Search className={`w-5 h-5 ${isSearching ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </form>
      
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {['Tokyo, Japan', 'New York, USA', 'Paris, France', 'Sydney, Australia', 'Cairo, Egypt'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setQuery(suggestion);
              onSearch(suggestion);
            }}
            disabled={isSearching}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:bg-white hover:border-purple-300 hover:text-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
