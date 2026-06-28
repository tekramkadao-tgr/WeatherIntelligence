export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  country_code?: string;
  timezone?: string;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
}

export interface DailyForecastData {
  time: string[];
  weatherCode: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  precipitationSum: number[];
  uvIndexMax: number[];
  sunrise: string[];
  sunset: string[];
}

export interface WeatherData {
  current: CurrentWeatherData;
  daily: DailyForecastData;
}

export interface WeatherCondition {
  label: string;
  description: string;
  iconName: string;
  bgGradient: string;
  textColor: string;
}

export interface PlanningRecommendation {
  id: string;
  type: 'clothing' | 'activity' | 'protection' | 'health';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'success' | 'alert';
}
