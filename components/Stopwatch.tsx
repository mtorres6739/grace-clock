'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StopwatchProps {
  fontSize: number;
  fontFamily: string;
}

export function Stopwatch({ fontSize, fontFamily }: StopwatchProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: ms.toString().padStart(2, '0')
    };
  };

  const { minutes, seconds, milliseconds } = formatTime(time);

  const getFontClass = (fontFamily: string) => {
    switch (fontFamily) {
      case 'roboto': return 'font-roboto';
      case 'poppins': return 'font-poppins';
      case 'playfair': return 'font-playfair';
      case 'montserrat': return 'font-montserrat';
      default: return 'font-inter';
    }
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <Card className="glass-dark border-white/10 p-8 max-w-md mx-auto">
      <div className="text-center animate-fade-in">
        <h3 className="text-white/90 text-xl font-medium mb-6">Stopwatch</h3>
        <div 
          className={cn(
            "text-white font-bold leading-none tracking-tight mb-8 tabular-nums",
            getFontClass(fontFamily)
          )}
          style={{ fontSize: `${fontSize}px` }}
        >
          {minutes}:{seconds}.{milliseconds}
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleStartStop}
            size="lg"
            className={cn(
              "min-w-[120px] transition-colors",
              isRunning 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
            )}
          >
            {isRunning ? 'Stop' : 'Start'}
          </Button>
          
          <Button
            onClick={handleReset}
            size="lg"
            variant="outline"
            className="min-w-[120px] bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}