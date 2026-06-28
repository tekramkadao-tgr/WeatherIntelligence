import { WeatherCondition, WeatherData, PlanningRecommendation } from '../types';

export function getWeatherCondition(code: number, isDay: boolean = true): WeatherCondition {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Sunny' : 'Clear Sky',
        description: isDay ? 'Perfectly clear and sunny sky.' : 'Clear starry night sky.',
        iconName: isDay ? 'Sun' : 'Moon',
        bgGradient: isDay 
          ? 'from-amber-400 via-orange-400 to-amber-500' 
          : 'from-slate-900 via-slate-800 to-indigo-950',
        textColor: isDay ? 'text-amber-950' : 'text-slate-100',
      };
    case 1:
    case 2:
    case 3: {
      const label = code === 1 ? 'Mainly Clear' : code === 2 ? 'Partly Cloudy' : 'Overcast';
      const desc = code === 1 ? 'Mainly clear sky with brief cloud coverage.' : code === 2 ? 'Scattered clouds.' : 'Thick overcast clouds.';
      const icon = code === 1 ? (isDay ? 'CloudSun' : 'CloudMoon') : code === 2 ? 'Cloud' : 'Clouds';
      return {
        label,
        description: desc,
        iconName: icon,
        bgGradient: isDay
          ? code === 3 
            ? 'from-slate-300 to-slate-500' 
            : 'from-blue-300 via-indigo-200 to-slate-300'
          : 'from-slate-900 via-indigo-950 to-slate-900',
        textColor: isDay && code !== 3 ? 'text-indigo-950' : 'text-white',
      };
    }
    case 45:
    case 48:
      return {
        label: 'Foggy',
        description: 'Reduced visibility due to dense fog or rime fog.',
        iconName: 'CloudFog',
        bgGradient: 'from-slate-300 via-zinc-400 to-slate-500',
        textColor: 'text-zinc-950',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        description: 'Light but persistent misty rain/drizzle.',
        iconName: 'CloudDrizzle',
        bgGradient: 'from-cyan-100 via-slate-300 to-sky-200',
        textColor: 'text-cyan-950',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Freezing drizzle causing dangerous thin ice films.',
        iconName: 'CloudSnow',
        bgGradient: 'from-sky-200 via-slate-200 to-blue-300',
        textColor: 'text-blue-950',
      };
    case 61:
    case 63:
    case 65: {
      const label = code === 61 ? 'Light Rain' : code === 63 ? 'Moderate Rain' : 'Heavy Rain';
      const desc = code === 61 ? 'Slight continuous rainfall.' : code === 63 ? 'Steady, moderate rain.' : 'Torrential downpours, high accumulation.';
      return {
        label,
        description: desc,
        iconName: 'CloudRain',
        bgGradient: 'from-slate-700 via-slate-800 to-indigo-900',
        textColor: 'text-white',
      };
    }
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Rain that freezes on contact with icy surfaces.',
        iconName: 'CloudSnow',
        bgGradient: 'from-sky-300 via-slate-400 to-blue-400',
        textColor: 'text-blue-950',
      };
    case 71:
    case 73:
    case 75: {
      const label = code === 71 ? 'Light Snow' : code === 73 ? 'Moderate Snow' : 'Heavy Snow';
      return {
        label,
        description: `${label} with significant accumulation.`,
        iconName: 'CloudSnow',
        bgGradient: 'from-blue-50 via-slate-100 to-sky-100',
        textColor: 'text-sky-950',
      };
    }
    case 77:
      return {
        label: 'Snow Grains',
        description: 'Very small white grains of ice falling.',
        iconName: 'CloudSnow',
        bgGradient: 'from-slate-100 to-sky-200',
        textColor: 'text-slate-900',
      };
    case 80:
    case 81:
    case 82: {
      const label = code === 80 ? 'Light Rain Showers' : code === 81 ? 'Rain Showers' : 'Violent Rain Showers';
      return {
        label,
        description: 'Intermittent localized downpours.',
        iconName: 'CloudRainShowers',
        bgGradient: 'from-sky-800 via-blue-900 to-slate-900',
        textColor: 'text-white',
      };
    }
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Sudden, intermittent heavy snow showers.',
        iconName: 'CloudSnow',
        bgGradient: 'from-blue-100 to-zinc-300',
        textColor: 'text-slate-950',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Thunderstorm activity with active lightning strike warnings.',
        iconName: 'CloudLightning',
        bgGradient: 'from-purple-900 via-slate-900 to-indigo-950',
        textColor: 'text-purple-100',
      };
    case 96:
    case 99:
      return {
        label: 'Severe Thunderstorm',
        description: 'Severe thunderstorm with active hail precipitation.',
        iconName: 'CloudLightning',
        bgGradient: 'from-red-950 via-purple-950 to-slate-950',
        textColor: 'text-red-100',
      };
    default:
      return {
        label: 'Unknown',
        description: 'Unrecognized WMO meteorological status code.',
        iconName: 'HelpCircle',
        bgGradient: 'from-slate-400 to-slate-600',
        textColor: 'text-slate-950',
      };
  }
}

export function generatePlanningRecommendations(data: WeatherData): PlanningRecommendation[] {
  const list: PlanningRecommendation[] = [];
  const currentTemp = data.current.temperature;
  const currentRain = data.current.precipitation;
  const currentCode = data.current.weatherCode;
  const currentWind = data.current.windSpeed;
  const currentHumidity = data.current.humidity;

  const maxUV = data.daily.uvIndexMax[0] || 0;
  const maxTempToday = data.daily.temperatureMax[0] || currentTemp;

  // 1. CLOTHING RECOMMENDATIONS
  if (currentTemp < 5) {
    list.push({
      id: 'clothing_freezing',
      type: 'clothing',
      title: 'Freezing Conditions Wear',
      description: 'Heavy insulated coat, scarf, gloves, and thermal base layers are essential to protect against freezing temperatures.',
      severity: 'alert',
    });
  } else if (currentTemp < 13) {
    list.push({
      id: 'clothing_cold',
      type: 'clothing',
      title: 'Chilly Day Essentials',
      description: 'A cozy coat or heavy sweater over layered clothing will keep you warm in these cool conditions.',
      severity: 'info',
    });
  } else if (currentTemp < 20) {
    list.push({
      id: 'clothing_mild',
      type: 'clothing',
      title: 'Mild Weather Layers',
      description: 'Comfortable pants and a light sweater, cardigan, or denim jacket are perfect for this mild day.',
      severity: 'info',
    });
  } else if (currentTemp < 28) {
    list.push({
      id: 'clothing_warm',
      type: 'clothing',
      title: 'Light Breathable Attire',
      description: 'Great weather for shorts, t-shirts, and light dresses. Stick to breathable fabrics like cotton or linen.',
      severity: 'success',
    });
  } else {
    list.push({
      id: 'clothing_hot',
      type: 'clothing',
      title: 'Heatwave Activewear',
      description: 'Extremely warm. Wear loose, light-colored clothing and a wide-brimmed sun hat to stay cool and ventilated.',
      severity: 'warning',
    });
  }

  // 2. PROTECTION RECOMMENDATIONS (Rain, Sun/UV, Wind)
  // Umbrella/Rain check
  const isRainy = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(currentCode) || currentRain > 0;
  if (isRainy) {
    list.push({
      id: 'gear_rain',
      type: 'protection',
      title: 'Carry an Umbrella',
      description: 'Active precipitation or high probability of rain. Grab a durable umbrella, water-resistant shell, and sealed footwear.',
      severity: 'alert',
    });
  }

  // Sun / UV Protection
  if (maxUV >= 6) {
    list.push({
      id: 'gear_sun_high',
      type: 'protection',
      title: 'High UV Alert: SPF 30+',
      description: `The maximum UV index is high (${maxUV}). Wear SPF 30+ sunscreen, don polarized sunglasses, and seek shade during peak solar hours (11 AM to 4 PM).`,
      severity: 'warning',
    });
  } else if (maxUV >= 3) {
    list.push({
      id: 'gear_sun_mod',
      type: 'protection',
      title: 'Moderate UV Protection',
      description: `Moderate UV radiation (${maxUV}). Light sunscreen and sunglasses are recommended if spending extended periods outdoors.`,
      severity: 'info',
    });
  }

  // Wind protection
  if (currentWind >= 30) {
    list.push({
      id: 'gear_wind_high',
      type: 'protection',
      title: 'High Winds Protection',
      description: `Strong gusts up to ${currentWind} km/h. Secure lightweight outdoor furniture and hold on to your personal items. A windbreaker jacket is highly advised.`,
      severity: 'warning',
    });
  } else if (currentWind >= 15) {
    list.push({
      id: 'gear_wind_mod',
      type: 'protection',
      title: 'Breezy Weather Alert',
      description: 'A noticeable breeze is blowing. Perfect for kite flying, but keep a light layer handy to avoid wind chill.',
      severity: 'info',
    });
  }

  // 3. HEALTH & HYDRATION RECOMMENDATIONS
  if (maxTempToday >= 30) {
    list.push({
      id: 'health_hydration_high',
      type: 'health',
      title: 'Stay Active, Stay Hydrated',
      description: `Peak temperatures will reach ${maxTempToday}°C. Double your standard water intake. Avoid intense outdoor workouts during peak afternoon heat.`,
      severity: 'warning',
    });
  } else if (currentHumidity > 80 && currentTemp > 24) {
    list.push({
      id: 'health_humidity',
      type: 'health',
      title: 'High Humidity Muggy Alert',
      description: 'Muggy and humid air may make it feel warmer than the actual thermometer reading. Pace yourself and seek air conditioning if sensitive.',
      severity: 'info',
    });
  } else if (currentHumidity < 30) {
    list.push({
      id: 'health_dry_air',
      type: 'health',
      title: 'Dry Atmospheric Alert',
      description: 'Very dry air (Humidity is below 30%). Stay hydrated and consider using skin moisturizer or lip balm to prevent dry lips and skin.',
      severity: 'info',
    });
  }

  // 4. OUTDOOR ACTIVITIES
  const isExcellentOutdoor = !isRainy && currentTemp >= 15 && currentTemp <= 26 && currentWind < 20;
  if (isExcellentOutdoor) {
    list.push({
      id: 'activity_outdoor',
      type: 'activity',
      title: 'Perfect Day for Outdoor Pursuits',
      description: 'Ideal atmospheric conditions! Splendid day for hiking, running, a bicycle ride, or a relaxing park picnic.',
      severity: 'success',
    });
  } else if (isRainy || currentTemp < 2 || currentTemp > 35 || currentWind > 35) {
    list.push({
      id: 'activity_indoor',
      type: 'activity',
      title: 'Indoor Activities Advised',
      description: 'Unfavorable meteorological elements outdoors. Ideal time for reading, working inside, watching a movie, or doing home exercises.',
      severity: 'info',
    });
  } else {
    list.push({
      id: 'activity_neutral',
      type: 'activity',
      title: 'Standard Outdoor Adaptability',
      description: 'Decent weather for most standard routines. Just plan around mild wind or occasional clouds.',
      severity: 'info',
    });
  }

  return list;
}

export function formatDayName(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  // Format to day name (e.g. "Sunday")
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  // Format to e.g. "Jun 28"
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatTime(timeStr: string): string {
  const d = new Date(timeStr);
  if (isNaN(d.getTime())) {
    // try formatting raw ISO string extracts (e.g., "06:12")
    return timeStr;
  }
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}
