export type AlarmSound = 'alarm1' | 'alarm2' | 'alarm3' | 'alarm4' | 'alarm5' | 'alarm6';

export const ALARM_SOUNDS: Record<AlarmSound, { name: string; description: string; filename: string }> = {
  alarm1: { 
    name: 'Classic Alarm', 
    description: 'Traditional alarm clock bell', 
    filename: 'alarm1.mp3' 
  },
  alarm2: { 
    name: 'Digital Beep', 
    description: 'Modern digital alarm sound', 
    filename: 'alarm2.mp3' 
  },
  alarm3: { 
    name: 'Gentle Chime', 
    description: 'Soft and pleasant wake-up sound', 
    filename: 'alarm3.mp3' 
  },
  alarm4: { 
    name: 'Urgent Alert', 
    description: 'Attention-grabbing alarm', 
    filename: 'alarm4.mp3' 
  },
  alarm5: { 
    name: 'School Bell', 
    description: 'Classic school bell ring', 
    filename: 'alarm5.mp3' 
  },
  alarm6: { 
    name: 'Electronic Buzz', 
    description: 'Futuristic alarm sound', 
    filename: 'alarm6.mp3' 
  }
};

export function createAlarmSound(type: AlarmSound): { play: () => void; stop: () => void } {
  let audio: HTMLAudioElement | null = null;
  let isPlaying = false;

  const play = () => {
    if (isPlaying) return;
    isPlaying = true;

    const soundFile = ALARM_SOUNDS[type].filename;
    audio = new Audio(`/sounds/${soundFile}`);
    audio.loop = true;
    audio.volume = 0.7;
    
    audio.play().catch(err => {
      console.error('Error playing alarm sound:', err);
      // Fallback to generated sound if audio file fails
      playFallbackSound(type);
    });
  };

  const stop = () => {
    isPlaying = false;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio = null;
    }
  };

  // Fallback to generated sounds if audio files are not available
  const playFallbackSound = (type: AlarmSound) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different patterns for different alarm types
    switch (type) {
      case 'alarm1':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        break;
      case 'alarm2':
        oscillator.frequency.value = 1000;
        oscillator.type = 'square';
        break;
      case 'alarm3':
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        break;
      case 'alarm4':
        oscillator.frequency.value = 1200;
        oscillator.type = 'sawtooth';
        break;
      case 'alarm5':
        oscillator.frequency.value = 900;
        oscillator.type = 'triangle';
        break;
      case 'alarm6':
        oscillator.frequency.value = 1500;
        oscillator.type = 'square';
        break;
    }
    
    gainNode.gain.value = 0.3;
    oscillator.start();
    
    // Create beeping pattern
    const beepInterval = setInterval(() => {
      if (!isPlaying) {
        clearInterval(beepInterval);
        oscillator.stop();
        audioContext.close();
        return;
      }
      gainNode.gain.value = gainNode.gain.value > 0 ? 0 : 0.3;
    }, 300);
  };

  return { play, stop };
}