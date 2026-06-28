import React from 'react';
import { 
  Sun, 
  Moon, 
  CloudSun, 
  CloudMoon, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  HelpCircle
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
}

export default function WeatherIcon({ name, className }: WeatherIconProps) {
  switch (name) {
    case 'Sun':
      return <Sun className={className} />;
    case 'Moon':
      return <Moon className={className} />;
    case 'CloudSun':
      return <CloudSun className={className} />;
    case 'CloudMoon':
      return <CloudMoon className={className} />;
    case 'Cloud':
      return <Cloud className={className} />;
    case 'Clouds':
      return <Cloud className={`${className || ''} opacity-90`} />;
    case 'CloudFog':
      return <CloudFog className={className} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={className} />;
    case 'CloudRain':
    case 'CloudRainShowers':
      return <CloudRain className={className} />;
    case 'CloudSnow':
      return <CloudSnow className={className} />;
    case 'CloudLightning':
      return <CloudLightning className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
}
