'use client';

import { ClockSettings } from '@/types';
import { Clock } from './Clock';
import { AnalogClock } from './AnalogClock';
import { Stopwatch } from './Stopwatch';
import { Timer } from './Timer';
import { cn } from '@/lib/utils';

interface ClockDisplayProps {
  settings: ClockSettings;
}

export function ClockDisplay({ settings }: ClockDisplayProps) {
  const renderContent = () => {
    if (settings.clockMode === 'stopwatch') {
      return <Stopwatch fontSize={settings.fontSize} fontFamily={settings.fontFamily} />;
    }
    
    if (settings.clockMode === 'timer') {
      return <Timer fontSize={settings.fontSize} fontFamily={settings.fontFamily} alarmSound={settings.alarmSound} />;
    }
    
    // Clock mode
    if (settings.clockType === 'analog') {
      return (
        <div className="flex flex-col items-center gap-4">
          <AnalogClock size={settings.fontSize * 3} />
          <div className="text-white/70 text-lg">{new Date().toLocaleDateString()}</div>
        </div>
      );
    }
    
    return <Clock settings={settings} timezone={settings.primaryTimezone} />;
  };

  return (
    <div 
      className="text-center animate-fade-in transition-all duration-500 ease-out"
      style={{ 
        transform: `translateY(${Math.max(Math.min(settings.topPadding, 200), -200)}px)`
      }}
    >
      {renderContent()}
    </div>
  );
}