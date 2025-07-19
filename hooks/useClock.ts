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

  const formatTime = (is24Hour: boolean, showSeconds: boolean = true) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    if (is24Hour) {
      const timeString = showSeconds 
        ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      return {
        time: timeString,
        period: ''
      };
    } else {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      
      const timeString = showSeconds
        ? `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      return {
        time: timeString,
        period
      };
    }
  };

  const getDate = () => {
    return time.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return {
    time,
    formatTime,
    getDate
  };
}
