'use client';

import { useClock } from '@/hooks/useClock';
import { ClockSettings } from '@/types';
import { cn } from '@/lib/utils';

interface ClockProps {
  settings: ClockSettings;
  timezone?: string;
  showLabel?: boolean;
  label?: string;
}

export function Clock({ settings, timezone, showLabel = false, label }: ClockProps) {
  const { formatTime, getDate } = useClock();
  const { time, period } = formatTime(settings.is24Hour, settings.showSeconds, timezone);

  const getFontClass = (fontFamily: string) => {
    switch (fontFamily) {
      case 'roboto': return 'font-roboto';
      case 'poppins': return 'font-poppins';
      case 'playfair': return 'font-playfair';
      case 'montserrat': return 'font-montserrat';
      default: return 'font-inter';
    }
  };

  return (
    <div 
      className="text-center animate-fade-in transition-all duration-500 ease-out"
      style={{ 
        paddingTop: `${settings.topPadding}px`,
        transform: settings.topPadding !== 0 ? 'translateY(0)' : undefined
      }}
    >
      {showLabel && label && (
        <div 
          className={cn(
            "text-white/90 mb-2 font-medium tracking-wide",
            getFontClass(settings.fontFamily)
          )}
          style={{ fontSize: `${Math.max(settings.fontSize * 0.2, 14)}px` }}
        >
          {label}
        </div>
      )}
      
      <div 
        className={cn(
          "text-white font-bold leading-none tracking-tight transition-all duration-300",
          getFontClass(settings.fontFamily)
        )}
        style={{ fontSize: `${settings.fontSize}px` }}
        role="timer"
        aria-live="polite"
        aria-label={`Current time: ${time} ${period || ''}`}
      >
        {time}
        {period && !settings.is24Hour && (
          <span 
            className="ml-2 opacity-80"
            style={{ fontSize: `${settings.fontSize * 0.4}px` }}
          >
            {period}
          </span>
        )}
      </div>
      
      <div 
        className={cn(
          "text-white/70 mt-4 font-medium tracking-wide transition-all duration-300",
          getFontClass(settings.fontFamily)
        )}
        style={{ fontSize: `${Math.max(settings.fontSize * 0.25, 16)}px` }}
      >
        {getDate(timezone)}
      </div>
    </div>
  );
}
