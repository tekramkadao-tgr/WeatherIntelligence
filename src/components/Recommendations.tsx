import React from 'react';
import { motion } from 'motion/react';
import { 
  Shirt, 
  Shield, 
  Droplet, 
  Compass, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  AlertOctagon 
} from 'lucide-react';
import { PlanningRecommendation } from '../types';

interface RecommendationsProps {
  recommendations: PlanningRecommendation[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  // Map types to Lucide Icons
  const getIcon = (type: string) => {
    switch (type) {
      case 'clothing':
        return <Shirt className="w-5 h-5" />;
      case 'protection':
        return <Shield className="w-5 h-5" />;
      case 'health':
        return <Droplet className="w-5 h-5" />;
      case 'activity':
        return <Compass className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  // Map severity levels to classes
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'alert':
        return {
          card: 'bg-rose-950/20 border-rose-800/40 text-rose-200',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          iconContainer: 'bg-rose-500/15 text-rose-400',
          severityIcon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
        };
      case 'warning':
        return {
          card: 'bg-amber-950/15 border-amber-800/40 text-amber-200',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          iconContainer: 'bg-amber-500/15 text-amber-400',
          severityIcon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        };
      case 'success':
        return {
          card: 'bg-emerald-950/15 border-emerald-800/40 text-emerald-200',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          iconContainer: 'bg-emerald-500/15 text-emerald-400',
          severityIcon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
        };
      case 'info':
      default:
        return {
          card: 'bg-blue-950/15 border-blue-800/40 text-blue-200',
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          iconContainer: 'bg-blue-500/15 text-blue-400',
          severityIcon: <Info className="w-4 h-4 text-blue-400" />,
        };
    }
  };

  // Map type labels to readable headers
  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'clothing':
        return 'Clothing Advice';
      case 'protection':
        return 'Gear & Protection';
      case 'health':
        return 'Health & Hydration';
      case 'activity':
        return 'Outdoor Planning';
      default:
        return 'General Advice';
    }
  };

  // Stagger container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  return (
    <div className="w-full" id="weather-recommendations-section">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-2 h-4 rounded-sm bg-gradient-to-b from-indigo-500 to-cyan-500"></span>
          Planning & Actionable Recommendations
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Intelligent clothing, activity, and safety protocols optimized for today's forecast
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {recommendations.map((rec) => {
          const styles = getSeverityStyles(rec.severity);
          return (
            <motion.div
              key={rec.id}
              variants={itemVariants}
              className={`p-4 rounded-2xl border backdrop-blur-md flex gap-4 ${styles.card} transition-all duration-300 hover:scale-[1.01]`}
              id={`rec-card-${rec.id}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${styles.iconContainer}`}>
                {getIcon(rec.type)}
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-slate-100 truncate">
                    {rec.title}
                  </h4>
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider ${styles.badge} flex items-center gap-1`}>
                      {styles.severityIcon}
                      {rec.severity}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {rec.description}
                </p>
                <div className="text-[10px] text-slate-400 font-medium">
                  Category: {getCategoryLabel(rec.type)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
