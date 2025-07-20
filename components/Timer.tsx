'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Confetti } from './Confetti';
import { createAlarmSound, type AlarmSound } from '@/lib/sounds-urls';

interface TimerProps {
  fontSize: number;
  fontFamily: string;
  alarmSound: AlarmSound;
}

export function Timer({ fontSize, fontFamily, alarmSound }: TimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('5');
  const [inputSeconds, setInputSeconds] = useState('0');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmRef = useRef<ReturnType<typeof createAlarmSound> | null>(null);

  useEffect(() => {
    // Create alarm sound instance
    alarmRef.current = createAlarmSound(alarmSound);
    
    return () => {
      if (alarmRef.current) {
        alarmRef.current.stop();
      }
    };
  }, [alarmSound]);

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsExpired(true);
            setShowConfetti(true);
            if (alarmRef.current) {
              alarmRef.current.play();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
  }, [isRunning, remainingSeconds]);

  const stopAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.stop();
    }
    setIsExpired(false);
    setShowConfetti(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const { minutes, seconds } = formatTime(remainingSeconds);

  const getFontClass = (fontFamily: string) => {
    switch (fontFamily) {
      case 'roboto': return 'font-roboto';
      case 'poppins': return 'font-poppins';
      case 'playfair': return 'font-playfair';
      case 'montserrat': return 'font-montserrat';
      default: return 'font-inter';
    }
  };

  const handleStart = () => {
    const mins = parseInt(inputMinutes) || 0;
    const secs = parseInt(inputSeconds) || 0;
    const total = mins * 60 + secs;
    
    if (total > 0) {
      setTotalSeconds(total);
      setRemainingSeconds(total);
      setIsRunning(true);
      setIsExpired(false);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setIsExpired(false);
    stopAlarm();
  };

  // Calculate responsive sizing based on font size
  const needsScaling = fontSize > 100;
  const scaleFactor = needsScaling ? Math.min(1, 100 / fontSize) : 1;

  return (
    <Card className="glass-dark border-white/10 p-8 mx-auto w-full max-w-2xl overflow-hidden">
      <div className="text-center animate-fade-in">
        <Confetti isActive={showConfetti} />

        {!isRunning && remainingSeconds === 0 ? (
          <div className="space-y-6">
            <h3 className="text-white/90 text-xl font-medium mb-4">Set Timer Duration</h3>
            <div className="flex gap-4 justify-center items-end">
              <div className="text-center">
                <label className="text-white/70 text-sm block mb-2">Minutes</label>
                <Input
                  type="number"
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(e.target.value)}
                  className="w-24 text-center bg-white/10 border-white/20 text-white text-xl"
                  min="0"
                  max="99"
                />
              </div>
              <div className="text-white text-2xl mb-3">:</div>
              <div className="text-center">
                <label className="text-white/70 text-sm block mb-2">Seconds</label>
                <Input
                  type="number"
                  value={inputSeconds}
                  onChange={(e) => setInputSeconds(e.target.value)}
                  className="w-24 text-center bg-white/10 border-white/20 text-white text-xl"
                  min="0"
                  max="59"
                />
              </div>
            </div>
            <Button
              onClick={handleStart}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]"
            >
              Start Timer
            </Button>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden px-4">
              <div 
                className={cn(
                  "text-white font-bold leading-none tracking-tight mb-8 tabular-nums whitespace-nowrap inline-block transition-transform",
                  getFontClass(fontFamily),
                  remainingSeconds <= 10 && remainingSeconds > 0 && "text-red-400 animate-pulse"
                )}
                style={{ 
                  fontSize: `${fontSize}px`,
                  transform: `scale(${scaleFactor})`,
                  transformOrigin: 'center'
                }}
              >
                {minutes}:{seconds}
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button
                onClick={isRunning ? handleStop : handleStart}
                size="lg"
                className={cn(
                  "min-w-[120px] transition-colors",
                  isRunning 
                    ? "bg-orange-600 hover:bg-orange-700 text-white" 
                    : "bg-green-600 hover:bg-green-700 text-white"
                )}
              >
                {isRunning ? 'Pause' : 'Resume'}
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
          </>
        )}

        <AlertDialog open={isExpired} onOpenChange={() => {}}>
          <AlertDialogContent className="bg-black/90 border-white/20 text-white">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">⏰</div>
              <h2 className="text-2xl font-bold">Your time is up!</h2>
              <p className="text-white/70">The timer has finished.</p>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={stopAlarm}
                className="bg-red-600 hover:bg-red-700 text-white w-full"
              >
                Turn Off Alarm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}