'use client';

import { useState, useEffect } from 'react';
import { ClockSettings } from '@/types';
import { getUserTimezone } from '@/data/timezones';

const DEFAULT_SETTINGS: ClockSettings = {
  fontSize: 80,
  fontFamily: 'inter',
  showSeconds: true,
  is24Hour: false,
  backgroundGradient: 'sunset',
  topPadding: 0,
  // NEW: Background image settings
  backgroundType: 'image',
  backgroundImage: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  backgroundImageId: 'default-1',
  // NEW: Clock type and mode settings
  clockType: 'digital',
  clockMode: 'clock',
  // NEW: Alarm sound settings
  alarmSound: 'alarm1',
  // NEW: Timezone settings
  primaryTimezone: getUserTimezone(),
  additionalTimezones: [],
  timezoneDisplayMode: 'both',
  maxTimezonesDisplayed: 4,
  // NEW: Bible version settings
  bibleVersion: 'NIV'
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
        
        // Ensure timezone settings exist (backward compatibility)
        if (!mergedSettings.primaryTimezone) {
          mergedSettings.primaryTimezone = DEFAULT_SETTINGS.primaryTimezone;
        }
        if (!mergedSettings.additionalTimezones) {
          mergedSettings.additionalTimezones = DEFAULT_SETTINGS.additionalTimezones;
        }
        if (!mergedSettings.timezoneDisplayMode) {
          mergedSettings.timezoneDisplayMode = DEFAULT_SETTINGS.timezoneDisplayMode;
        }
        if (typeof mergedSettings.maxTimezonesDisplayed !== 'number') {
          mergedSettings.maxTimezonesDisplayed = DEFAULT_SETTINGS.maxTimezonesDisplayed;
        }
        
        // Ensure Bible version exists (backward compatibility)
        if (!mergedSettings.bibleVersion) {
          mergedSettings.bibleVersion = DEFAULT_SETTINGS.bibleVersion;
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