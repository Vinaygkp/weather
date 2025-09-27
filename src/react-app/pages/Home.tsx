import { useLocationSearch } from '@/react-app/hooks/useLocationSearch';
import SearchBar from '@/react-app/components/SearchBar';
import WeatherCard from '@/react-app/components/WeatherCard';
import TimeCard from '@/react-app/components/TimeCard';
import PlaceInfoCard from '@/react-app/components/PlaceInfoCard';
import { Globe, Sparkles } from 'lucide-react';
import React, { useState } from "react";
import NewsCard from "../components/NewsCard";

const Home: React.FC = () => {
  const { searchResult, isSearching, searchLocation } = useLocationSearch();

  const [city, setCity] = useState("Tokyo"); // default city

  // ✅ handleSearch ek hi jagah rahega
  const handleSearch = (query: string) => {
    if (query.trim() !== "") {
      setCity(query.trim());      // update NewsCard
      searchLocation(query);      // update Weather, Time, Place
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="pt-12 pb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
              GlobeScope
            </h1>
            <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
          </div>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto px-4">
            Discover places around the world with real-time weather, local time, and fascinating insights
          </p>
        </header>

        {/* Search Section */}
        <section className="px-4 mb-12">
          <SearchBar onSearch={handleSearch} isSearching={isSearching} />
        </section>

        {/* Results Section */}
        {searchResult && (
          <section className="px-4 pb-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {searchResult.location.name}
                </h2>
                <p className="text-lg text-gray-600">
                  {searchResult.location.display_name}
                </p>
              </div>

              {/* Error State */}
              {searchResult.error && (
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <div className="text-red-600 font-medium mb-2">
                      Unable to fetch location data
                    </div>
                    <div className="text-red-500 text-sm">
                      {searchResult.error}
                    </div>
                  </div>
                </div>
              )}

              {/* Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <WeatherCard weather={searchResult.weather} loading={searchResult.loading} />
                </div>
                <div className="lg:col-span-1">
                  <TimeCard timeInfo={searchResult.timeInfo} loading={searchResult.loading} />
                </div>
                <div className="lg:col-span-1">
                  <PlaceInfoCard 
                    placeInfo={searchResult.placeInfo}
                    locationName={searchResult.location.name}
                    loading={searchResult.loading}
                  />
                </div>
              </div>

              {/* Coordinates Info */}
              {!searchResult.loading && searchResult.location.lat && searchResult.location.lon && (
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600 shadow-sm">
                    <span>📍</span>
                    <span>
                      {searchResult.location.lat.toFixed(4)}°, {searchResult.location.lon.toFixed(4)}°
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* News Section */}
        <section className="px-4 py-12 text-center">
          <NewsCard city={city} />
        </section>

        {/* Welcome Message */}
        {!searchResult && !isSearching && (
          <section className="px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
                <div className="text-6xl mb-6">🌍</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Explore the World
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Search for any city, state, or country to discover its current weather conditions, 
                  local time, and interesting facts. From bustling metropolises to remote villages, 
                  every place has a story to tell.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
