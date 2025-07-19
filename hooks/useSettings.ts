'use client';

import { useState, useEffect } from 'react';
import { ClockSettings } from '@/types';

const DEFAULT_SETTINGS: ClockSettings = {
  fontSize: 80,
  fontFamily: 'inter',
  showSeconds: true,
  is24Hour: false,
  backgroundGradient: 'sunset',
  topPadding: 0,
  // NEW: Background image settings
  backgroundType: 'gradient',
  backgroundImage: undefined,
  backgroundImageId: undefined,
  // NEW: Clock type and mode settings
  clockType: 'digital',
  clockMode: 'clock',
  // NEW: Alarm sound settings
  alarmSound: 'alarm1'
};

export function useSettings() {
  const [settings, setSettings] = useState<ClockSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('clockSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        // Ensure backward compatibility by merging with defaults
        const mergedSettings = { ...DEFAULT_SETTINGS, ...parsed };
        
        // Validate topPadding if it exists
        if (typeof mergedSettings.topPadding !== 'number' || 
            mergedSettings.topPadding < -200 || 
            mergedSettings.topPadding > 400) {
          mergedSettings.topPadding = DEFAULT_SETTINGS.topPadding;
        }

        // Ensure showSeconds exists (backward compatibility)
        if (typeof mergedSettings.showSeconds !== 'boolean') {
          mergedSettings.showSeconds = DEFAULT_SETTINGS.showSeconds;
        }

        // Ensure backgroundType exists (backward compatibility)
        if (!mergedSettings.backgroundType) {
          mergedSettings.backgroundType = DEFAULT_SETTINGS.backgroundType;
        }

        // Ensure clockType and clockMode exist (backward compatibility)
        if (!mergedSettings.clockType) {
          mergedSettings.clockType = DEFAULT_SETTINGS.clockType;
        }
        if (!mergedSettings.clockMode) {
          mergedSettings.clockMode = DEFAULT_SETTINGS.clockMode;
        }
        // Ensure alarmSound exists (backward compatibility)
        if (!mergedSettings.alarmSound) {
          mergedSettings.alarmSound = DEFAULT_SETTINGS.alarmSound;
        }
        
        setSettings(mergedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Fallback to defaults on error
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateSettings = (newSettings: Partial<ClockSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    
    // Validate topPadding before saving
    if (newSettings.topPadding !== undefined) {
      updatedSettings.topPadding = Math.max(-200, Math.min(400, newSettings.topPadding));
    }
    
    setSettings(updatedSettings);
    
    try {
      localStorage.setItem('clockSettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem('clockSettings');
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoaded
  };
}