import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Wind, 
  Droplets, 
  Thermometer, 
  Clock, 
  Loader2, 
  AlertCircle, 
  Sun, 
  Compass,
  CornerDownRight
} from 'lucide-react';
import { Location, WeatherData } from '../types';
import { getWeatherCondition, formatTime } from '../utils/weatherUtils';
import WeatherIcon from './WeatherIcon';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

interface CurrentWeatherProps {
  location: Location;
  weatherData: WeatherData;
  isLoading: boolean;
  onCitySelect: (city: Location) => void;
  onUseCurrentLocation: () => void;
  isGeolocating: boolean;
  geolocateError: string | null;
}

export default function CurrentWeather({
  location,
  weatherData,
  isLoading,
  onCitySelect,
  onUseCurrentLocation,
  isGeolocating,
  geolocateError
}: CurrentWeatherProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch cities when search query changes (debounced)
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setSearchError(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            searchQuery
          )}&count=6&language=en&format=json`
        );
        if (!res.ok) throw new Error('Failed to fetch location candidates.');
        
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          // Map to our Location interface
          const formattedLocations: Location[] = data.results.map((item: any) => ({
            id: item.id,
            name: item.name,
            latitude: item.latitude,
            longitude: item.longitude,
            country: item.country || '',
            admin1: item.admin1 || '',
            country_code: item.country_code || '',
            timezone: item.timezone || 'auto'
          }));
          setSuggestions(formattedLocations);
          setSearchError(null);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setSearchError(`No cities found matching "${searchQuery}"`);
          setShowDropdown(true);
        }
      } catch (err) {
        setSearchError('Error fetching geocoding results. Please check connection.');
        setSuggestions([]);
        setShowDropdown(true);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSelectCity = (city: Location) => {
    onCitySelect(city);
    setSearchQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectCity(suggestions[0]);
    } else if (!isSearching && searchQuery.trim().length >= 2) {
      setSearchError(`Could not find coordinates for "${searchQuery}". Please select from suggestions.`);
    }
  };

  const { current, daily } = weatherData;
  const condition = getWeatherCondition(current.weatherCode, current.isDay);

  // Format local current time
  const localTimeStr = (() => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: location.timezone && location.timezone !== 'auto' ? location.timezone : undefined
      };
      return new Intl.DateTimeFormat('en-US', options).format(new Date());
    } catch (e) {
      return formatTime(current.time);
    }
  })();

  const maxTempToday = daily.temperatureMax[0] ? Math.round(daily.temperatureMax[0]) : Math.round(current.temperature);
  const minTempToday = daily.temperatureMin[0] ? Math.round(daily.temperatureMin[0]) : Math.round(current.temperature);

  return (
    <div className="space-y-6" id="current-weather-section">
      {/* Search Input and Location actions */}
      <div className="relative" ref={dropdownRef}>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </span>
            <input
              type="text"
              placeholder="Search city name (e.g. London, Tokyo, Paris)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/80 rounded-2xl text-slate-200 placeholder-slate-500 outline-none text-sm font-sans transition-all shadow-inner focus:shadow-indigo-500/5 focus:ring-1 focus:ring-indigo-500/30"
              id="city-search-input"
            />
          </div>
          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isGeolocating}
            className="px-4 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 disabled:bg-slate-950 disabled:text-slate-600 rounded-2xl text-slate-300 font-medium text-xs flex items-center gap-2 transition-all hover:border-slate-700 shrink-0 shadow-sm cursor-pointer"
            title="Locate me using GPS"
            id="gps-locate-btn"
          >
            {isGeolocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            ) : (
              <MapPin className="w-4 h-4 text-sky-400" />
            )}
            <span className="hidden sm:inline">Use Location</span>
          </button>
        </form>

        {/* Dropdown Candidate Suggestions & Errors */}
        <AnimatePresence>
          {showDropdown && (searchQuery.trim().length >= 2 || geolocateError || searchError) && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute z-50 left-0 right-0 mt-2 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg"
              id="search-suggestions-dropdown"
            >
              {geolocateError && (
                <div className="p-4 border-b border-rose-900/20 bg-rose-950/10 text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold">GPS Location Error</p>
                    <p className="opacity-90">{geolocateError}</p>
                  </div>
                </div>
              )}

              {searchError && (
                <div className="p-4 border-b border-amber-900/20 bg-amber-950/10 text-amber-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold">No Results</p>
                    <p className="opacity-90">{searchError}</p>
                  </div>
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="py-2 divide-y divide-slate-800/40">
                  <div className="px-3.5 py-1.5 text-[10px] text-slate-500 font-bold tracking-wider uppercase">
                    Select a Location Candidate
                  </div>
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectCity(item)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-800/80 flex items-center justify-between gap-4 text-sm transition-all text-slate-300 hover:text-white"
                    >
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-slate-100">{item.name}</p>
                          <p className="text-xs text-slate-400">
                            {[item.admin1, item.country].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                      {item.country_code && (
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-400 uppercase">
                          {item.country_code}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Core Weather Display Card */}
      <div 
        className={`relative overflow-hidden rounded-3xl border border-slate-800 p-6 md:p-8 bg-gradient-to-br ${condition.bgGradient} shadow-xl shadow-black/20`}
        id="current-weather-card"
      >
        {/* Decorative glass overlay */}
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]"></div>

        <div className="relative z-10 space-y-6">
          {/* Location details Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-black/25 text-white/90 backdrop-blur-md rounded-full border border-white/5 uppercase tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                {location.name}, {location.country}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                {location.name}
              </h1>
              {location.admin1 && (
                <p className="text-xs text-white/70 font-medium">
                  Region: {location.admin1} ({location.country_code?.toUpperCase()})
                </p>
              )}
            </div>

            {/* Time badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-xl text-xs text-white/80 font-mono border border-white/5 shrink-0 w-fit">
              <Clock className="w-3.5 h-3.5 text-indigo-300" />
              <span>Local Time: {localTimeStr}</span>
            </div>
          </div>

          {/* Temperature and Visual State Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-4">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2.5xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/15 shrink-0 hover:scale-105 transition-all duration-300">
                <AnimatedWeatherIcon name={condition.iconName} className={`${condition.textColor} drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]`} size={52} />
              </div>
              <div>
                <div className="flex items-baseline">
                  <span className="text-6xl sm:text-7xl font-extrabold text-white tracking-tighter drop-shadow-md select-none font-sans">
                    {Math.round(current.temperature)}
                  </span>
                  <span className="text-3xl sm:text-4xl font-light text-white/85 ml-1">°C</span>
                </div>
                <div className="space-y-0.5 mt-1">
                  <span className="text-sm font-bold text-white block drop-shadow-sm">
                    {condition.label}
                  </span>
                  <span className="text-xs text-white/85 block max-w-xs leading-relaxed">
                    {condition.description}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
              <div className="text-right">
                <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider block">Today's Range</span>
                <span className="text-sm font-mono font-bold text-white">
                  High: <span className="text-orange-300">{maxTempToday}°</span> / Low: <span className="text-sky-300">{minTempToday}°</span>
                </span>
              </div>
            </div>
          </div>

          {/* Core Secondary Meteorological Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            {/* Feels Like */}
            <div className="bg-black/20 p-3 rounded-2xl border border-white/5 space-y-1 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-white/60">
                <Thermometer className="w-4 h-4 text-red-300" />
                <span className="text-xs font-semibold">Feels Like</span>
              </div>
              <span className="text-base font-bold text-white font-mono block">
                {Math.round(current.apparentTemperature)}°C
              </span>
              <span className="text-[10px] text-white/50 block">Apparent temperature</span>
            </div>

            {/* Humidity */}
            <div className="bg-black/20 p-3 rounded-2xl border border-white/5 space-y-1 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-white/60">
                <Droplets className="w-4 h-4 text-cyan-300" />
                <span className="text-xs font-semibold">Humidity</span>
              </div>
              <span className="text-base font-bold text-white font-mono block">
                {current.humidity}%
              </span>
              <span className="text-[10px] text-white/50 block">Moisture retention</span>
            </div>

            {/* Wind Speed */}
            <div className="bg-black/20 p-3 rounded-2xl border border-white/5 space-y-1 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-white/60">
                <Wind className="w-4 h-4 text-teal-300" />
                <span className="text-xs font-semibold">Wind Speed</span>
              </div>
              <span className="text-base font-bold text-white font-mono block">
                {current.windSpeed.toFixed(1)} <span className="text-xs font-normal">km/h</span>
              </span>
              <span className="text-[10px] text-white/50 block">Anemometer value</span>
            </div>

            {/* Precipitation */}
            <div className="bg-black/20 p-3 rounded-2xl border border-white/5 space-y-1 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-white/60">
                <Compass className="w-4 h-4 text-sky-300" />
                <span className="text-xs font-semibold">Precipitation</span>
              </div>
              <span className="text-base font-bold text-white font-mono block">
                {current.precipitation.toFixed(1)} <span className="text-xs font-normal">mm</span>
              </span>
              <span className="text-[10px] text-white/50 block">Current water deposit</span>
            </div>
          </div>
        </div>

        {/* Dynamic floating graphic icon matching weather condition */}
        <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none transform scale-125">
          <AnimatedWeatherIcon name={condition.iconName} className="w-56 h-56 text-white" size={224} />
        </div>
      </div>
    </div>
  );
}
