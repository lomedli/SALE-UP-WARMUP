import React from 'react';
import { Check, Lock, Play } from 'lucide-react';
import { DayConfig } from '../types';

interface TimelineItemProps {
  day: DayConfig;
  status: 'locked' | 'open' | 'completed';
  onClick: () => void;
  isLast: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ day, status, onClick, isLast }) => {
  
  return (
    <div className="relative flex gap-4 group">
      {/* Vertical Line */}
      {!isLast && (
        <div 
          className={`absolute top-12 bottom-[-48px] right-[1.65rem] w-1 
          ${status === 'completed' ? 'bg-brand-teal' : 'bg-slate-200'}`} 
        />
      )}

      {/* Icon Indicator */}
      <div className="flex-shrink-0 mt-1 z-10">
        <div 
          className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-colors duration-300
          ${status === 'completed' 
            ? 'bg-brand-teal border-brand-teal text-white' 
            : status === 'open' 
              ? 'bg-white border-brand-teal text-brand-teal shadow-[0_0_15px_rgba(20,184,166,0.3)]' 
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
        >
          {status === 'completed' ? (
            <Check size={24} strokeWidth={3} />
          ) : status === 'locked' ? (
            <Lock size={20} />
          ) : (
            <span className="text-xl font-bold">{day.id}</span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div 
        onClick={() => status !== 'locked' && onClick()}
        className={`flex-1 p-4 rounded-2xl border-2 mb-6 transition-all duration-200 relative overflow-hidden
        ${status === 'locked' 
          ? 'bg-slate-50 border-transparent opacity-70 cursor-not-allowed' 
          : 'bg-white border-slate-100 hover:border-brand-teal/30 hover:shadow-lg cursor-pointer'
        }`}
      >
        {status === 'open' && (
           <div className="absolute top-0 left-0 w-1 h-full bg-brand-teal animate-pulse" />
        )}

        <div className="flex justify-between items-center">
          <div>
            <h3 className={`font-bold text-lg ${status === 'locked' ? 'text-slate-500' : 'text-slate-800'}`}>
              {day.title}
            </h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-1">
              {day.description}
            </p>
          </div>
          
          {status !== 'locked' && (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center
              ${status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-brand-teal/10 text-brand-teal'}
            `}>
              {status === 'completed' ? (
                 <Check size={20} />
              ) : (
                 <Play size={20} className="ml-1" /> 
              )}
            </div>
          )}
        </div>
        
        {status === 'open' && (
            <div className="mt-3 inline-block text-xs font-semibold text-brand-teal bg-brand-teal/10 px-2 py-1 rounded-md">
                לחץ להתחלת משימות
            </div>
        )}
      </div>
    </div>
  );
};