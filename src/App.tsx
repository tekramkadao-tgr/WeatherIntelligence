import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudSun, 
  RefreshCw, 
  AlertCircle, 
  TrendingUp, 
  Activity, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { Location, WeatherData } from './types';
import { generatePlanningRecommendations } from './utils/weatherUtils';
import CurrentWeather from './components/CurrentWeather';
import ForecastChart from './components/ForecastChart';
import ForecastDays from './components/ForecastDays';
import Recommendations from './components/Recommendations';

// Default Location: New York, NY, USA
const DEFAULT_CITY: Location = {
  id: 5128581,
  name: "New York",
  latitude: 40.7128,
  longitude: -74.0060,
  country: "United States",
  admin1: "New York",
  country_code: "US",
  timezone: "America/New_York"
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState<Location>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geolocateError, setGeolocateError] = useState<string | null>(null);

  // Fetch forecast data whenever selectedCity changes
  const fetchWeather = async (city: Location) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,sunrise,sunset&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather forecast service is currently unreachable.");
      
      const data = await res.json();
      
      // Map to WeatherData structure
      const mappedData: WeatherData = {
        current: {
          time: data.current.time,
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          apparentTemperature: data.current.apparent_temperature,
          isDay: data.current.is_day === 1,
          precipitation: data.current.precipitation,
          weatherCode: data.current.weather_code,
          windSpeed: data.current.wind_speed_10m
        },
        daily: {
          time: data.daily.time,
          weatherCode: data.daily.weather_code,
          temperatureMax: data.daily.temperature_2m_max,
          temperatureMin: data.daily.temperature_2m_min,
          precipitationSum: data.daily.precipitation_sum,
          uvIndexMax: data.daily.uv_index_max,
          sunrise: data.daily.sunrise,
          sunset: data.daily.sunset
        }
      };

      setWeatherData(mappedData);
    } catch (err: any) {
      setFetchError(err.message || "An unexpected error occurred while loading weather data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity]);

  // Request user's coordinates
  const handleUseCurrentLocation = () => {
    setIsGeolocating(true);
    setGeolocateError(null);
    
    if (!navigator.geolocation) {
      setGeolocateError("GPS location lookup is not supported by your browser.");
      setIsGeolocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Attempt reverse lookup for standard metadata display
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
          let name = "Current Location";
          let country = "Local Region";
          let countryCode = "GPS";
          let admin1 = undefined;
          
          if (res.ok) {
            const resData = await res.json();
            if (resData.address) {
              name = resData.address.city || resData.address.town || resData.address.suburb || resData.address.village || "Current Location";
              country = resData.address.country || "Local Region";
              countryCode = resData.address.country_code || "GPS";
              admin1 = resData.address.state || resData.address.region;
            }
          }
          
          setSelectedCity({
            id: Date.now(),
            name,
            latitude,
            longitude,
            country,
            country_code: countryCode,
            admin1,
            timezone: 'auto'
          });
        } catch (err) {
          // Fallback if reverse lookup fails
          setSelectedCity({
            id: Date.now(),
            name: "Current Location",
            latitude,
            longitude,
            country: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
            country_code: "GPS",
            timezone: 'auto'
          });
        } finally {
          setIsGeolocating(false);
        }
      },
      (error) => {
        let msg = "Failed to access your location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "GPS access was denied by your browser. Please search manually.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "GPS coordinates are currently unavailable.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out. Please retry.";
        }
        setGeolocateError(msg);
        setIsGeolocating(false);
      },
      { timeout: 7000 }
    );
  };

  const handleRefresh = () => {
    fetchWeather(selectedCity);
  };

  const recommendations = weatherData ? generatePlanningRecommendations(weatherData) : [];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans relative antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Absolute background accent lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Primary Header Navigation Bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <CloudSun className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                Weather Intelligence
              </span>
              <span className="text-[10px] text-indigo-400/80 block font-semibold leading-none tracking-wider uppercase">
                Met-Engine Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick API status */}
            <div className="hidden xs:flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Open-Meteo Engine Ready
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 disabled:opacity-50 text-slate-300 rounded-xl transition-all cursor-pointer"
              title="Refresh Forecast Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Space */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        
        {/* Network or Geocoding Failures Display */}
        {fetchError && (
          <div className="p-4 bg-rose-950/10 border border-rose-900/30 text-rose-200 text-xs rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Error loading weather forecast</p>
              <p className="opacity-90 leading-relaxed">{fetchError}</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 text-indigo-300 font-semibold hover:underline block cursor-pointer"
              >
                Attempt connection retry
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Skeleton Loading / Loaded Grid */}
        <AnimatePresence mode="wait">
          {isLoading && !weatherData ? (
            <motion.div
              key="loading-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Skeleton Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="h-12 bg-slate-900/50 rounded-2xl animate-pulse"></div>
                <div className="h-96 bg-slate-900/30 rounded-3xl animate-pulse"></div>
                <div className="h-64 bg-slate-900/30 rounded-2xl animate-pulse"></div>
              </div>

              {/* Right Skeleton Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="h-60 bg-slate-900/30 rounded-2xl animate-pulse"></div>
                <div className="h-80 bg-slate-900/30 rounded-2xl animate-pulse"></div>
              </div>
            </motion.div>
          ) : weatherData ? (
            <motion.div
              key="weather-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Left Segment: Input + Current Weather Card + Chart */}
              <div className="lg:col-span-7 space-y-6">
                <CurrentWeather
                  location={selectedCity}
                  weatherData={weatherData}
                  isLoading={isLoading}
                  onCitySelect={setSelectedCity}
                  onUseCurrentLocation={handleUseCurrentLocation}
                  isGeolocating={isGeolocating}
                  geolocateError={geolocateError}
                />
                
                <ForecastChart dailyData={weatherData.daily} />
              </div>

              {/* Right Segment: Recommendations + 7-Day Forecast */}
              <div className="lg:col-span-5 space-y-6">
                <Recommendations recommendations={recommendations} />
                
                <ForecastDays dailyData={weatherData.daily} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Humble Footer */}
      <footer className="border-t border-slate-900 py-6 mt-12 bg-slate-950/40 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans">
            Weather Intelligence App — Real-time forecasts powered by <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Open-Meteo</a> API.
          </p>
          <div className="flex items-center gap-1.5 text-slate-600 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Updates hourly • No cookies stored</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
