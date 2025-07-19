export type AlarmSound = 'buzzer' | 'bell' | 'digital' | 'classic' | 'gentle';

export const ALARM_SOUNDS: Record<AlarmSound, { name: string; description: string }> = {
  buzzer: { name: 'Buzzer', description: 'Classic alarm buzzer sound' },
  bell: { name: 'Bell', description: 'Traditional bell ringing' },
  digital: { name: 'Digital', description: 'Modern digital beep' },
  classic: { name: 'Classic', description: 'Traditional alarm clock' },
  gentle: { name: 'Gentle', description: 'Soft, pleasant chime' }
};

export function createAlarmSound(type: AlarmSound): { play: () => void; stop: () => void } {
  let audioContext: AudioContext | null = null;
  let oscillator: OscillatorNode | null = null;
  let gainNode: GainNode | null = null;
  let isPlaying = false;
  let intervalId: NodeJS.Timeout | null = null;

  const play = () => {
    if (isPlaying) return;
    isPlaying = true;

    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    switch (type) {
      case 'buzzer':
        playBuzzer();
        break;
      case 'bell':
        playBell();
        break;
      case 'digital':
        playDigital();
        break;
      case 'classic':
        playClassic();
        break;
      case 'gentle':
        playGentle();
        break;
    }
  };

  const stop = () => {
    isPlaying = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (oscillator) {
      oscillator.stop();
      oscillator = null;
    }
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
  };

  const playBuzzer = () => {
    const beepDuration = 200;
    const pauseDuration = 100;
    
    const createBeep = () => {
      if (!audioContext || !isPlaying) return;
      
      oscillator = audioContext.createOscillator();
      gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 1000;
      oscillator.type = 'square';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      
      setTimeout(() => {
        if (oscillator) {
          oscillator.stop();
          oscillator = null;
        }
      }, beepDuration);
    };

    createBeep();
    intervalId = setInterval(createBeep, beepDuration + pauseDuration);
  };

  const playBell = () => {
    const playBellSound = () => {
      if (!audioContext || !isPlaying) return;
      
      // Create multiple oscillators for bell harmonics
      const frequencies = [800, 1600, 2400, 3200];
      const oscillators: OscillatorNode[] = [];
      
      frequencies.forEach((freq, index) => {
        if (!audioContext) return;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        // Decay envelope for bell sound
        gain.gain.setValueAtTime(0.2 / (index + 1), audioContext!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext!.currentTime + 1);
        
        osc.start();
        osc.stop(audioContext!.currentTime + 1);
        
        oscillators.push(osc);
      });
    };

    playBellSound();
    intervalId = setInterval(playBellSound, 1500);
  };

  const playDigital = () => {
    const beepSequence = () => {
      if (!audioContext || !isPlaying) return;
      
      const beepCount = 3;
      const beepDuration = 100;
      const beepGap = 50;
      
      for (let i = 0; i < beepCount; i++) {
        setTimeout(() => {
          if (!audioContext || !isPlaying) return;
          
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(audioContext.destination);
          
          osc.frequency.value = 2000;
          osc.type = 'sine';
          gain.gain.value = 0.2;
          
          osc.start();
          osc.stop(audioContext.currentTime + beepDuration / 1000);
        }, i * (beepDuration + beepGap));
      }
    };

    beepSequence();
    intervalId = setInterval(beepSequence, 1000);
  };

  const playClassic = () => {
    let frequency = 500;
    let direction = 1;
    
    const sweep = () => {
      if (!audioContext || !isPlaying) return;
      
      oscillator = audioContext.createOscillator();
      gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'square';
      gainNode.gain.value = 0.15;
      
      // Frequency sweep
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      frequency += 50 * direction;
      if (frequency > 1000 || frequency < 500) {
        direction *= -1;
      }
      
      oscillator.start();
    };

    sweep();
    intervalId = setInterval(() => {
      if (oscillator) {
        oscillator.stop();
        oscillator = null;
      }
      sweep();
    }, 100);
  };

  const playGentle = () => {
    const chime = () => {
      if (!audioContext || !isPlaying) return;
      
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (C major chord)
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          if (!audioContext || !isPlaying) return;
          
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(audioContext.destination);
          
          osc.frequency.value = freq;
          osc.type = 'sine';
          
          // Gentle fade in and out
          gain.gain.setValueAtTime(0, audioContext.currentTime);
          gain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
          
          osc.start();
          osc.stop(audioContext.currentTime + 2);
        }, index * 200);
      });
    };

    chime();
    intervalId = setInterval(chime, 3000);
  };

  return { play, stop };
}