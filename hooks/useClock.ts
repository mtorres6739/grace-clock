'use client';

import { useState, useEffect } from 'react';

export function useClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (is24Hour: boolean, showSeconds: boolean = true, timezone?: string) => {
    // Create a formatter with the specific timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: showSeconds ? 'numeric' : undefined,
      hour12: false,
      timeZone: timezone || undefined
    });
    
    const parts = formatter.formatToParts(time);
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
    const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
    const second = showSeconds ? parseInt(parts.find(p => p.type === 'second')?.value || '0') : 0;

    if (is24Hour) {
      const timeString = showSeconds 
        ? `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
        : `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      return {
        time: timeString,
        period: ''
      };
    } else {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHours = hour % 12 || 12;
      
      const timeString = showSeconds
        ? `${displayHours.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
        : `${displayHours.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      return {
        time: timeString,
        period
      };
    }
  };

  const getDate = (timezone?: string) => {
    return time.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone
    });
  };

  const getTimeForTimezone = (timezone: string, is24Hour: boolean, showSeconds: boolean = true) => {
    return formatTime(is24Hour, showSeconds, timezone);
  };

  return {
    time,
    formatTime,
    getDate,
    getTimeForTimezone
  };
}
