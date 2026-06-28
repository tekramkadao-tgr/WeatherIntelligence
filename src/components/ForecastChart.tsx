import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { DailyForecastData } from '../types';
import { formatShortDate, formatDayName } from '../utils/weatherUtils';

interface ForecastChartProps {
  dailyData: DailyForecastData;
}

export default function ForecastChart({ dailyData }: ForecastChartProps) {
  // Format the raw daily lists into a structured array for Recharts
  const chartData = dailyData.time.map((date, idx) => {
    return {
      date: formatShortDate(date),
      day: formatDayName(date).substring(0, 3), // e.g. "Sun"
      fullDay: formatDayName(date),
      "Max Temp": Math.round(dailyData.temperatureMax[idx]),
      "Min Temp": Math.round(dailyData.temperatureMin[idx]),
    };
  });

  // Calculate some chart details for better axis limits
  const allTemps = [...dailyData.temperatureMax, ...dailyData.temperatureMin];
  const minTemp = Math.floor(Math.min(...allTemps) - 2);
  const maxTemp = Math.ceil(Math.max(...allTemps) + 2);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/60 p-4 rounded-xl shadow-xl backdrop-blur-md text-xs">
          <p className="font-semibold text-slate-200 mb-2">{payload[0].payload.fullDay} ({payload[0].payload.date})</p>
          <div className="space-y-1">
            <p className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5 text-orange-400">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
                Daily High:
              </span>
              <span className="font-mono font-bold text-slate-100">{payload[0].value}°C</span>
            </p>
            <p className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
                Daily Low:
              </span>
              <span className="font-mono font-bold text-slate-100">{payload[1].value}°C</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-800 pt-1">
              Spread: {payload[0].value - payload[1].value}°C difference
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-5 md:p-6" id="weather-temp-chart-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-2 h-4 rounded-sm bg-gradient-to-b from-orange-500 to-sky-500"></span>
            7-Day Temperature Trend
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Visualize the temperature margin across the week</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-orange-400">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Max Temp
          </span>
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Min Temp
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              domain={[minTemp, maxTemp]} 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dx={-5}
              tickFormatter={(val) => `${val}°`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            {/* Freezing threshold reference line if min temp goes below zero */}
            {minTemp <= 0 && (
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1} label={{ value: 'Freezing (0°C)', fill: '#ef4444', fontSize: 10, position: 'top' }} />
            )}

            <Line 
              type="monotone" 
              dataKey="Max Temp" 
              stroke="#f97316" 
              strokeWidth={3} 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#f97316' }}
              dot={{ r: 4, strokeWidth: 1.5, fill: '#0f172a', stroke: '#f97316' }}
            />
            <Line 
              type="monotone" 
              dataKey="Min Temp" 
              stroke="#06b6d4" 
              strokeWidth={3} 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#06b6d4' }}
              dot={{ r: 4, strokeWidth: 1.5, fill: '#0f172a', stroke: '#06b6d4' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
