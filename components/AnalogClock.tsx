'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnalogClockProps {
  size?: number;
  className?: string;
}

export function AnalogClock({ size = 200, className }: AnalogClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = (seconds * 6) - 90;
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90;
  const hourAngle = (hours * 30 + minutes * 0.5) - 90;

  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-lg"
      >
        {/* Clock face */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius - 10}
          fill="rgba(255, 255, 255, 0.1)"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
        />
        
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = centerX + (radius - 20) * Math.cos(angle);
          const y1 = centerY + (radius - 20) * Math.sin(angle);
          const x2 = centerX + (radius - 30) * Math.cos(angle);
          const y2 = centerY + (radius - 30) * Math.sin(angle);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        {/* Minute markers */}
        {[...Array(60)].map((_, i) => {
          if (i % 5 !== 0) {
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const x1 = centerX + (radius - 20) * Math.cos(angle);
            const y1 = centerY + (radius - 20) * Math.sin(angle);
            const x2 = centerX + (radius - 25) * Math.cos(angle);
            const y2 = centerY + (radius - 25) * Math.sin(angle);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            );
          }
          return null;
        })}

        {/* Hour hand */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + (radius * 0.5) * Math.cos(hourAngle * Math.PI / 180)}
          y2={centerY + (radius * 0.5) * Math.sin(hourAngle * Math.PI / 180)}
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="6"
          strokeLinecap="round"
          className="transition-transform duration-1000"
        />

        {/* Minute hand */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + (radius * 0.7) * Math.cos(minuteAngle * Math.PI / 180)}
          y2={centerY + (radius * 0.7) * Math.sin(minuteAngle * Math.PI / 180)}
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="4"
          strokeLinecap="round"
          className="transition-transform duration-1000"
        />

        {/* Second hand */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + (radius * 0.8) * Math.cos(secondAngle * Math.PI / 180)}
          y2={centerY + (radius * 0.8) * Math.sin(secondAngle * Math.PI / 180)}
          stroke="rgba(239, 68, 68, 0.8)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle
          cx={centerX}
          cy={centerY}
          r="8"
          fill="rgba(255, 255, 255, 0.9)"
        />
      </svg>
    </div>
  );
}