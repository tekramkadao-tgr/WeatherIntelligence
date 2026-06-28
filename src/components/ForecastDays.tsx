import React from 'react';
import { motion } from 'motion/react';
import { Droplet, Sun } from 'lucide-react';
import { DailyForecastData } from '../types';
import { formatDayName, formatShortDate, getWeatherCondition } from '../utils/weatherUtils';
import WeatherIcon from './WeatherIcon';

interface ForecastDaysProps {
  dailyData: DailyForecastData;
}

export default function ForecastDays({ dailyData }: ForecastDaysProps) {
  // Stagger container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } },
  };

  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-5 md:p-6" id="forecast-7day-card">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-2 h-4 rounded-sm bg-gradient-to-b from-blue-500 to-indigo-500"></span>
          7-Day Detailed Forecast
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">Comprehensive daily outlook and variables</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="divide-y divide-slate-800/60 space-y-1.5"
      >
        {dailyData.time.map((dateStr, idx) => {
          const isToday = idx === 0;
          const dayName = isToday ? 'Today' : formatDayName(dateStr);
          const shortDate = formatShortDate(dateStr);
          const tempMax = Math.round(dailyData.temperatureMax[idx]);
          const tempMin = Math.round(dailyData.temperatureMin[idx]);
          const precipSum = dailyData.precipitationSum[idx];
          const uvMax = dailyData.uvIndexMax[idx];
          const weatherCode = dailyData.weatherCode[idx];
          
          const condition = getWeatherCondition(weatherCode, true);

          return (
            <motion.div
              key={dateStr}
              variants={itemVariants}
              className={`pt-3.5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-all duration-300 hover:bg-slate-800/10 px-2 rounded-xl -mx-2 ${
                isToday ? 'bg-indigo-950/5 border border-indigo-500/10 -mx-1 px-3' : ''
              }`}
              id={`forecast-row-${idx}`}
            >
              {/* Day and Date */}
              <div className="w-32 shrink-0">
                <span className={`text-sm font-semibold block ${isToday ? 'text-indigo-400' : 'text-slate-100'}`}>
                  {dayName}
                </span>
                <span className="text-xs text-slate-500 font-mono">{shortDate}</span>
              </div>

              {/* Weather Condition */}
              <div className="flex items-center gap-3 flex-1 min-w-0 sm:justify-start">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${condition.bgGradient} flex items-center justify-center shadow-md shadow-black/10 shrink-0`}>
                  <WeatherIcon name={condition.iconName} className={`w-5 h-5 ${condition.textColor}`} />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-slate-200 block truncate group-hover:text-white transition-colors">
                    {condition.label}
                  </span>
                  <span className="text-xs text-slate-400 block truncate font-sans">
                    {condition.description}
                  </span>
                </div>
              </div>

              {/* Core Variables: UV and Precipitation */}
              <div className="flex items-center gap-5 sm:justify-end shrink-0 text-xs">
                {/* UV Index Badge */}
                {uvMax > 0 && (
                  <div className="flex items-center gap-1 text-slate-400 font-mono w-14" title={`Maximum UV Index: ${uvMax}`}>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>UV {Math.round(uvMax)}</span>
                  </div>
                )}

                {/* Rain / Water volume */}
                <div className="flex items-center gap-1 text-slate-400 font-mono w-20" title={`Expected Precipitation: ${precipSum}mm`}>
                  <Droplet className={`w-3.5 h-3.5 ${precipSum > 0 ? 'text-sky-400 fill-sky-400/20' : 'text-slate-600'}`} />
                  <span className={precipSum > 0 ? 'text-sky-300 font-semibold' : ''}>
                    {precipSum > 0 ? `${precipSum.toFixed(1)} mm` : '0 mm'}
                  </span>
                </div>

                {/* Temperature High/Low block */}
                <div className="flex items-center gap-2 font-mono w-24 justify-end text-sm">
                  <span className="font-bold text-orange-400 text-right">{tempMax}°</span>
                  <div className="w-8 h-1 rounded-full bg-slate-800 relative overflow-hidden hidden xs:block">
                    <span 
                      className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-sky-400 to-orange-400"
                      style={{ opacity: 0.7 }}
                    ></span>
                  </div>
                  <span className="text-slate-400 text-right">{tempMin}°</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
