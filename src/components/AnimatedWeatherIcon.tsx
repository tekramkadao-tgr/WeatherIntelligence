import React from 'react';
import { motion } from 'motion/react';

interface AnimatedWeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function AnimatedWeatherIcon({ name, className = '', size = 48 }: AnimatedWeatherIconProps) {
  // Common animation configurations
  const rotateTransition = {
    animate: { rotate: 360 },
    transition: {
      repeat: Infinity,
      duration: 12,
      ease: 'linear',
    },
  };

  const floatTransition = {
    animate: { y: [0, -4, 0] },
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: 'easeInOut',
    },
  };

  const pulseTransition = {
    animate: { scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] },
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: 'easeInOut',
    },
  };

  // Staggered raindrop / snowflake animation paths
  const dropAnimation = (delay: number) => ({
    animate: { y: [-2, 12], opacity: [0, 1, 0] },
    transition: {
      repeat: Infinity,
      duration: 1.5,
      delay,
      ease: 'easeIn',
    },
  });

  const driftLineAnimation = (delay: number) => ({
    animate: { x: [-5, 5, -5] },
    transition: {
      repeat: Infinity,
      duration: 3,
      delay,
      ease: 'easeInOut',
    },
  });

  const lightningFlash = {
    animate: { opacity: [0, 0, 1, 0, 0.8, 0, 0, 1, 0] },
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: 'linear',
    },
  };

  // Render SVG content based on icon type
  switch (name) {
    case 'Sun':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${className}`}
        >
          {/* Animated sun rays */}
          <motion.g {...rotateTransition} style={{ originX: '12px', originY: '12px' }}>
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </motion.g>
          {/* Pulsating center core */}
          <motion.circle
            cx="12"
            cy="12"
            r="4"
            fill="currentColor"
            fillOpacity="0.25"
            {...pulseTransition}
          />
        </svg>
      );

    case 'Moon':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${className}`}
        >
          {/* Breathing moon crescent */}
          <motion.path
            d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
            fill="currentColor"
            fillOpacity="0.15"
            animate={{ rotate: [-2, 2, -2], scale: [0.98, 1.02, 0.98] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            style={{ originX: '12px', originY: '12px' }}
          />
          {/* Twinkling star */}
          <motion.path
            d="M19 3v4M17 5h4"
            strokeWidth="1.5"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
          <motion.path
            d="M6 7v2M5 8h2"
            strokeWidth="1"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
          />
        </svg>
      );

    case 'CloudSun':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${className}`}
        >
          {/* Rotating sun in background */}
          <motion.g 
            {...rotateTransition} 
            style={{ originX: '16px', originY: '8px' }}
            className="text-amber-500"
          >
            <circle cx="16" cy="8" r="3" fill="currentColor" fillOpacity="0.1" />
            <line x1="16" y1="3" x2="16" y2="4" />
            <line x1="16" y1="12" x2="16" y2="13" />
            <line x1="11.5" y1="8" x2="12.5" y2="8" />
            <line x1="19.5" y1="8" x2="20.5" y2="8" />
            <line x1="12.8" y1="4.8" x2="13.5" y2="5.5" />
            <line x1="18.5" y1="10.5" x2="19.2" y2="11.2" />
            <line x1="12.8" y1="11.2" x2="13.5" y2="10.5" />
            <line x1="18.5" y1="5.5" x2="19.2" y2="4.8" />
          </motion.g>
          {/* Floating foreground cloud */}
          <motion.path
            d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 15.25"
            fill="currentColor"
            fillOpacity="0.1"
            {...floatTransition}
          />
        </svg>
      );

    case 'CloudMoon':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${className}`}
        >
          {/* Moon in background */}
          <motion.path
            d="M16 4a3.5 3.5 0 0 0 4.5 4.5A5.5 5.5 0 1 1 16 4Z"
            fill="currentColor"
            fillOpacity="0.1"
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            style={{ originX: '16px', originY: '8px' }}
            className="text-indigo-400"
          />
          {/* Floating foreground cloud */}
          <motion.path
            d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 15.25"
            fill="currentColor"
            fillOpacity="0.1"
            {...floatTransition}
          />
        </svg>
      );

    case 'Cloud':
    case 'Clouds':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${className}`}
        >
          {/* Dual drifting clouds for realism */}
          {name === 'Clouds' && (
            <motion.path
              d="M16 14a3 3 0 0 0 2.58-1.55A4.5 4.5 0 1 0 10 9h-.63a5 5 0 1 0-2.3 8.2"
              fill="currentColor"
              fillOpacity="0.05"
              className="opacity-60"
              animate={{ x: [-3, 2, -3], y: [-1, 2, -1] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            />
          )}
          <motion.path
            d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 15.25"
            fill="currentColor"
            fillOpacity="0.15"
            {...floatTransition}
          />
        </svg>
      );

    case 'CloudFog':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${className}`}
        >
          {/* Cloud base */}
          <motion.path
            d="M20 14.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 12.25"
            fill="currentColor"
            fillOpacity="0.08"
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          />
          {/* Animated fog sliding lines */}
          <motion.line x1="2" y1="16" x2="22" y2="16" strokeDasharray="4 2" {...driftLineAnimation(0)} />
          <motion.line x1="4" y1="19" x2="20" y2="19" strokeDasharray="3 3" {...driftLineAnimation(0.5)} />
          <motion.line x1="1" y1="13" x2="14" y2="13" strokeDasharray="5 1" {...driftLineAnimation(1)} />
        </svg>
      );

    case 'CloudDrizzle':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${className}`}
        >
          {/* Cloud base */}
          <path d="M20 13.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 11.25" fill="currentColor" fillOpacity="0.1" />
          {/* Drops falling */}
          <motion.line x1="8" y1="14" x2="8" y2="18" strokeDasharray="1 1" {...dropAnimation(0)} />
          <motion.line x1="12" y1="14" x2="12" y2="18" strokeDasharray="1 1" {...dropAnimation(0.4)} />
          <motion.line x1="16" y1="14" x2="16" y2="18" strokeDasharray="1 1" {...dropAnimation(0.2)} />
        </svg>
      );

    case 'CloudRain':
    case 'CloudRainShowers':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${className}`}
        >
          {/* Floating rainy cloud */}
          <motion.path
            d="M20 13.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 11.25"
            fill="currentColor"
            fillOpacity="0.15"
            {...floatTransition}
          />
          {/* Falling heavy rain lines */}
          <motion.line x1="8" y1="14" x2="6" y2="20" {...dropAnimation(0)} />
          <motion.line x1="12" y1="14" x2="10" y2="20" {...dropAnimation(0.35)} />
          <motion.line x1="16" y1="14" x2="14" y2="20" {...dropAnimation(0.18)} />
        </svg>
      );

    case 'CloudSnow':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${className}`}
        >
          {/* Cloud base */}
          <path d="M20 13.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 11.25" fill="currentColor" fillOpacity="0.1" />
          {/* Animated snowflakes falling */}
          <motion.g {...dropAnimation(0)}>
            <circle cx="8" cy="15" r="1.5" fill="currentColor" />
          </motion.g>
          <motion.g {...dropAnimation(0.4)}>
            <circle cx="12" cy="15" r="1.5" fill="currentColor" />
          </motion.g>
          <motion.g {...dropAnimation(0.2)}>
            <circle cx="16" cy="15" r="1.5" fill="currentColor" />
          </motion.g>
          <motion.g {...dropAnimation(0.6)}>
            <circle cx="10" cy="17" r="1" fill="currentColor" />
          </motion.g>
          <motion.g {...dropAnimation(0.8)}>
            <circle cx="14" cy="17" r="1" fill="currentColor" />
          </motion.g>
        </svg>
      );

    case 'CloudLightning':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${className}`}
        >
          {/* Drifting storm cloud */}
          <motion.path
            d="M20 13.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 11.25"
            fill="currentColor"
            fillOpacity="0.15"
            {...floatTransition}
          />
          {/* Thunder bolt flashing */}
          <motion.path
            d="M13 11l-3 5h3.5l-1 5 5-7h-4.5z"
            fill="currentColor"
            className="text-amber-400"
            {...lightningFlash}
          />
          {/* Background rain during storm */}
          <motion.line x1="7" y1="15" x2="6" y2="18" opacity="0.4" {...dropAnimation(0.1)} />
          <motion.line x1="16" y1="15" x2="15" y2="18" opacity="0.4" {...dropAnimation(0.5)} />
        </svg>
      );

    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${className}`}
        >
          {/* pulsating mystery icon */}
          <motion.circle cx="12" cy="12" r="10" {...pulseTransition} />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
  }
}
