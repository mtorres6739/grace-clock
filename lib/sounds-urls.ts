import { CUSTOM_ALARM_URLS } from './alarm-config';

export type AlarmSound = 'alarm1' | 'alarm2' | 'alarm3' | 'alarm4' | 'alarm5' | 'alarm6';

// Merge custom URLs with defaults
export const ALARM_SOUNDS: Record<AlarmSound, { name: string; description: string; url: string }> = {
  alarm1: { 
    name: CUSTOM_ALARM_URLS.alarm1.url ? CUSTOM_ALARM_URLS.alarm1.name : 'Classic Bell', 
    description: CUSTOM_ALARM_URLS.alarm1.url ? CUSTOM_ALARM_URLS.alarm1.description : 'Traditional alarm clock bell', 
    url: CUSTOM_ALARM_URLS.alarm1.url || '/sounds/alarm1.mp3'
  },
  alarm2: { 
    name: CUSTOM_ALARM_URLS.alarm2.url ? CUSTOM_ALARM_URLS.alarm2.name : 'Digital Beep', 
    description: CUSTOM_ALARM_URLS.alarm2.url ? CUSTOM_ALARM_URLS.alarm2.description : 'Modern digital alarm sound', 
    url: CUSTOM_ALARM_URLS.alarm2.url || '/sounds/alarm2.mp3'
  },
  alarm3: { 
    name: CUSTOM_ALARM_URLS.alarm3.url ? CUSTOM_ALARM_URLS.alarm3.name : 'Gentle Chime', 
    description: CUSTOM_ALARM_URLS.alarm3.url ? CUSTOM_ALARM_URLS.alarm3.description : 'Soft and pleasant wake-up sound', 
    url: CUSTOM_ALARM_URLS.alarm3.url || '/sounds/alarm3.mp3'
  },
  alarm4: { 
    name: CUSTOM_ALARM_URLS.alarm4.url ? CUSTOM_ALARM_URLS.alarm4.name : 'Urgent Alert', 
    description: CUSTOM_ALARM_URLS.alarm4.url ? CUSTOM_ALARM_URLS.alarm4.description : 'Attention-grabbing alarm', 
    url: CUSTOM_ALARM_URLS.alarm4.url || '/sounds/alarm4.mp3'
  },
  alarm5: { 
    name: CUSTOM_ALARM_URLS.alarm5.url ? CUSTOM_ALARM_URLS.alarm5.name : 'School Bell', 
    description: CUSTOM_ALARM_URLS.alarm5.url ? CUSTOM_ALARM_URLS.alarm5.description : 'Classic school bell ring', 
    url: CUSTOM_ALARM_URLS.alarm5.url || '/sounds/alarm5.mp3'
  },
  alarm6: { 
    name: CUSTOM_ALARM_URLS.alarm6.url ? CUSTOM_ALARM_URLS.alarm6.name : 'Electronic Buzz', 
    description: CUSTOM_ALARM_URLS.alarm6.url ? CUSTOM_ALARM_URLS.alarm6.description : 'Futuristic alarm sound', 
    url: CUSTOM_ALARM_URLS.alarm6.url || '/sounds/alarm6.mp3'
  }
};

export function createAlarmSound(type: AlarmSound): { play: () => void; stop: () => void } {
  let audio: HTMLAudioElement | null = null;
  let isPlaying = false;
  let audioContext: AudioContext | null = null;
  let oscillator: OscillatorNode | null = null;
  let intervalId: NodeJS.Timeout | null = null;

  const play = () => {
    if (isPlaying) return;
    isPlaying = true;

    const soundUrl = ALARM_SOUNDS[type].url;
    
    // If URL starts with http, try to load it
    if (soundUrl.startsWith('http')) {
      audio = new Audio(soundUrl);
      audio.loop = true;
      audio.volume = 0.7;
      audio.crossOrigin = 'anonymous'; // Enable CORS
      
      audio.play().catch(err => {
        console.error('Error playing alarm sound from URL:', err);
        // Fallback to generated sound if external URL fails
        playGeneratedSound(type);
      });
    } else {
      // Try local file
      audio = new Audio(soundUrl);
      audio.loop = true;
      audio.volume = 0.7;
      
      audio.play().catch(err => {
        console.error('Error playing local alarm sound:', err);
        // Fallback to generated sound
        playGeneratedSound(type);
      });
    }
  };

  const stop = () => {
    isPlaying = false;
    
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio = null;
    }
    
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    
    if (oscillator) {
      oscillator.stop();
      oscillator = null;
    }
    
    if (audioContext) {
      audioContext!.close();
      audioContext = null;
    }
  };

  // High-quality generated sounds as fallback
  const playGeneratedSound = (type: AlarmSound) => {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    switch (type) {
      case 'alarm1':
        playClassicBell();
        break;
      case 'alarm2':
        playDigitalBeep();
        break;
      case 'alarm3':
        playGentleChime();
        break;
      case 'alarm4':
        playUrgentAlert();
        break;
      case 'alarm5':
        playSchoolBell();
        break;
      case 'alarm6':
        playElectronicBuzz();
        break;
    }
  };

  const playClassicBell = () => {
    if (!audioContext) return;
    
    intervalId = setInterval(() => {
      if (!audioContext || !isPlaying) return;
      
      // Create multiple oscillators for bell harmonics
      const frequencies = [800, 1600, 2400, 3200];
      frequencies.forEach((freq, index) => {
        const osc = audioContext!.createOscillator();
        const gain = audioContext!.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext!.destination);
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        // Decay envelope
        gain.gain.setValueAtTime(0.3 / (index + 1), audioContext!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext!.currentTime + 1);
        
        osc.start();
        osc.stop(audioContext!.currentTime + 1);
      });
    }, 1500);
  };

  const playDigitalBeep = () => {
    if (!audioContext) return;
    
    intervalId = setInterval(() => {
      if (!audioContext || !isPlaying) return;
      
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          if (!audioContext || !isPlaying) return;
          
          const osc = audioContext!.createOscillator();
          const gain = audioContext!.createGain();
          
          osc.connect(gain);
          gain.connect(audioContext!.destination);
          
          osc.frequency.value = 2000;
          osc.type = 'sine';
          gain.gain.value = 0.3;
          
          osc.start();
          osc.stop(audioContext!.currentTime + 0.1);
        }, i * 150);
      }
    }, 1000);
  };

  const playGentleChime = () => {
    if (!audioContext) return;
    
    intervalId = setInterval(() => {
      if (!audioContext || !isPlaying) return;
      
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          if (!audioContext || !isPlaying) return;
          
          const osc = audioContext!.createOscillator();
          const gain = audioContext!.createGain();
          
          osc.connect(gain);
          gain.connect(audioContext!.destination);
          
          osc.frequency.value = freq;
          osc.type = 'sine';
          
          gain.gain.setValueAtTime(0, audioContext!.currentTime);
          gain.gain.linearRampToValueAtTime(0.2, audioContext!.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext!.currentTime + 2);
          
          osc.start();
          osc.stop(audioContext!.currentTime + 2);
        }, index * 200);
      });
    }, 3000);
  };

  const playUrgentAlert = () => {
    if (!audioContext) return;
    
    let frequency = 800;
    intervalId = setInterval(() => {
      if (!audioContext || !isPlaying) return;
      
      const osc = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext!.destination);
      
      osc.frequency.value = frequency;
      osc.type = 'square';
      gain.gain.value = 0.2;
      
      osc.start();
      osc.stop(audioContext!.currentTime + 0.1);
      
      frequency = frequency === 800 ? 1200 : 800;
    }, 200);
  };

  const playSchoolBell = () => {
    if (!audioContext) return;
    
    const playBell = () => {
      if (!audioContext || !isPlaying) return;
      
      const osc = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext!.destination);
      
      osc.frequency.value = 1000;
      osc.type = 'triangle';
      
      // Bell envelope
      gain.gain.setValueAtTime(0.4, audioContext!.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext!.currentTime + 0.8);
      
      osc.start();
      osc.stop(audioContext!.currentTime + 0.8);
    };
    
    playBell();
    intervalId = setInterval(playBell, 1000);
  };

  const playElectronicBuzz = () => {
    if (!audioContext) return;
    
    intervalId = setInterval(() => {
      if (!audioContext || !isPlaying) return;
      
      const osc = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext!.destination);
      
      // Frequency modulation for buzz effect
      osc.frequency.setValueAtTime(100, audioContext!.currentTime);
      osc.frequency.linearRampToValueAtTime(1000, audioContext!.currentTime + 0.1);
      osc.frequency.linearRampToValueAtTime(100, audioContext!.currentTime + 0.2);
      
      osc.type = 'sawtooth';
      gain.gain.value = 0.15;
      
      osc.start();
      osc.stop(audioContext!.currentTime + 0.2);
    }, 300);
  };

  return { play, stop };
}