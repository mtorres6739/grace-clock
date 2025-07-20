'use client';

import { useSettings } from '@/hooks/useSettings';
import { ClockDisplay } from '@/components/ClockDisplay';
import { BibleVerseCard } from '@/components/BibleVerseCard';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { MultiTimezoneDisplay } from '@/components/MultiTimezoneDisplay';

const GRADIENT_STYLES = {
  sunset: 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-500',
  ocean: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
  forest: 'bg-gradient-to-br from-green-400 via-green-500 to-emerald-600',
  purple: 'bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600',
  rose: 'bg-gradient-to-br from-pink-400 via-rose-500 to-red-500',
  midnight: 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900'
};

export default function Home() {
  const { settings, updateSettings, resetSettings, isLoaded } = useSettings();

  const getBackgroundStyle = () => {
    // Image background takes priority
    if (settings.backgroundType === 'image' && settings.backgroundImage) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${settings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      };
    }
    
    // Custom gradient
    if (settings.backgroundGradient === 'custom' && settings.customColor1 && settings.customColor2) {
      return {
        background: `linear-gradient(135deg, ${settings.customColor1}, ${settings.customColor2})`
      };
    }
    
    return {};
  };

  const getBackgroundClass = () => {
    // No class needed for image backgrounds or custom gradients
    if (settings.backgroundType === 'image' || settings.backgroundGradient === 'custom') {
      return '';
    }
    
    return GRADIENT_STYLES[settings.backgroundGradient as keyof typeof GRADIENT_STYLES] || GRADIENT_STYLES.sunset;
  };

  // Calculate dynamic spacing based on clock position and font size
  const getContentSpacing = () => {
    // Much larger spacing to prevent overlap
    if (settings.fontSize > 200) {
      return 'space-y-32';  // 128px
    } else if (settings.fontSize > 160) {
      return 'space-y-24';  // 96px
    } else if (settings.fontSize > 120) {
      return 'space-y-20';  // 80px
    } else if (settings.fontSize > 80) {
      return 'space-y-16';  // 64px
    }
    return 'space-y-12';  // 48px minimum
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Skeleton className="h-20 w-96 bg-white/10" />
          <Skeleton className="h-6 w-64 bg-white/10 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main 
        className={`min-h-screen flex flex-col items-center transition-all duration-1000 ${getBackgroundClass()}`}
        style={getBackgroundStyle()}
      >
        {/* Background overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Settings Panel */}
        <SettingsPanel
          settings={settings}
          onSettingsChange={updateSettings}
          onReset={resetSettings}
        />

        {/* Main Content Container */}
        <div className="relative z-10 w-full flex-1 flex flex-col p-4">
          {/* Spacer top */}
          <div className="flex-1 max-h-32" />
          
          {/* Clock and Bible Verse Container */}
          <div className="w-full max-w-4xl mx-auto">
            <div className={getContentSpacing()}>
              {/* Clock Display - Always visible */}
              <div className="text-center" style={{ 
                marginBottom: settings.topPadding > 0 ? `${settings.topPadding}px` : '0',
                paddingBottom: settings.fontSize > 120 ? `${settings.fontSize}px` : '0'
              }}>
                <ClockDisplay settings={settings} />
              </div>

              {/* Multiple Timezones Display - Only show in clock mode */}
              {settings.clockMode === 'clock' && (
                <MultiTimezoneDisplay settings={settings} />
              )}

              {/* Bible Verse Card - Only show in clock mode */}
              {settings.clockMode === 'clock' && (
                <div className="max-w-2xl mx-auto">
                  <BibleVerseCard />
                </div>
              )}
            </div>
          </div>
          
          {/* Spacer bottom - grows to push content up */}
          <div className="flex-1 min-h-8" />
          
          {/* Footer */}
          <div className="mt-auto pt-8 pb-4">
            <p className="text-white/50 text-sm text-center">
              © Ethos Labs. 2025. All Rights Reserved.
            </p>
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}