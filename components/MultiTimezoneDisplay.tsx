'use client';

import { ClockSettings, TimezoneDisplay } from '@/types';
import { Clock } from './Clock';
import { getTimezoneOffset } from '@/data/timezones';

interface MultiTimezoneDisplayProps {
  settings: ClockSettings;
}

export function MultiTimezoneDisplay({ settings }: MultiTimezoneDisplayProps) {
  // Filter enabled timezones and limit to maxTimezonesDisplayed
  const activeTimezones = settings.additionalTimezones
    .filter(tz => tz.enabled)
    .slice(0, settings.maxTimezonesDisplayed);

  const getLabel = (tz: TimezoneDisplay) => {
    const offset = getTimezoneOffset(tz.timezone);
    
    switch (settings.timezoneDisplayMode) {
      case 'city':
        return tz.city;
      case 'timezone':
        return offset;
      case 'both':
        return `${tz.city} (${offset})`;
      default:
        return tz.city;
    }
  };

  // Calculate responsive font size for additional clocks
  const additionalClockFontSize = Math.max(settings.fontSize * 0.4, 32);
  const additionalClockSettings = {
    ...settings,
    fontSize: additionalClockFontSize
  };

  if (activeTimezones.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 space-y-8">
      <div className={`grid gap-8 ${
        activeTimezones.length === 1 ? 'grid-cols-1' :
        activeTimezones.length === 2 ? 'grid-cols-2' :
        activeTimezones.length === 3 ? 'grid-cols-3' :
        'grid-cols-2 md:grid-cols-4'
      }`}>
        {activeTimezones.map((tz) => (
          <div key={tz.id} className="text-center bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
            <Clock
              settings={additionalClockSettings}
              timezone={tz.timezone}
              showLabel={true}
              label={getLabel(tz)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}