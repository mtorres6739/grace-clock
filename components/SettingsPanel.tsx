'use client';

import { useState, useRef } from 'react';
import { ClockSettings, FontFamily, GradientPreset } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Settings, RotateCcw, Palette, Type, Clock, Move, Image as ImageIcon, Timer, Activity, Volume2, Play, Square } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { BackgroundSelector } from '@/components/BackgroundSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ALARM_SOUNDS, type AlarmSound, createAlarmSound } from '@/lib/sounds-urls';

interface SettingsPanelProps {
  settings: ClockSettings;
  onSettingsChange: (settings: Partial<ClockSettings>) => void;
  onReset: () => void;
}

const GRADIENT_PRESETS = {
  sunset: 'from-orange-400 via-red-500 to-pink-500',
  ocean: 'from-blue-400 via-blue-500 to-blue-600',
  forest: 'from-green-400 via-green-500 to-emerald-600',
  purple: 'from-purple-400 via-purple-500 to-indigo-600',
  rose: 'from-pink-400 via-rose-500 to-red-500',
  midnight: 'from-gray-700 via-gray-800 to-gray-900'
};

const FONT_OPTIONS: { value: FontFamily; label: string }[] = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'montserrat', label: 'Montserrat' }
];

export function SettingsPanel({ settings, onSettingsChange, onReset }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [playingSound, setPlayingSound] = useState<AlarmSound | null>(null);
  const soundRef = useRef<ReturnType<typeof createAlarmSound> | null>(null);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your clock settings have been saved successfully.",
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    onReset();
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  const getGradientStyle = () => {
    if (settings.backgroundGradient === 'custom' && settings.customColor1 && settings.customColor2) {
      return {
        background: `linear-gradient(135deg, ${settings.customColor1}, ${settings.customColor2})`
      };
    }
    
    const gradientClass = GRADIENT_PRESETS[settings.backgroundGradient as keyof typeof GRADIENT_PRESETS] || GRADIENT_PRESETS.sunset;
    return {
      background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
      backgroundImage: `linear-gradient(135deg, ${gradientClass.replace('from-', '').replace('via-', '').replace('to-', '').split(' ').map(color => `var(--${color})`).join(', ')})`
    };
  };

  const getPositionDescription = (padding: number) => {
    if (padding === 0) return 'Centered';
    if (padding > 0) return `${padding}px below center`;
    return `${Math.abs(padding)}px above center`;
  };

  const getTimePreview = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (settings.is24Hour) {
      return settings.showSeconds 
        ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      const displayHours = hours % 12 || 12;
      const period = hours >= 12 ? 'PM' : 'AM';
      const timeString = settings.showSeconds
        ? `${displayHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${displayHours}:${minutes.toString().padStart(2, '0')}`;
      return `${timeString} ${period}`;
    }
  };

  const handlePlaySound = (soundId: AlarmSound) => {
    // Stop any currently playing sound
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current = null;
    }

    if (playingSound === soundId) {
      // If clicking the same sound, stop it
      setPlayingSound(null);
    } else {
      // Play the new sound
      soundRef.current = createAlarmSound(soundId);
      soundRef.current.play();
      setPlayingSound(soundId);
      
      // Auto-stop after 3 seconds
      setTimeout(() => {
        if (soundRef.current) {
          soundRef.current.stop();
          soundRef.current = null;
        }
        setPlayingSound(null);
      }, 3000);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      // Stop any playing sound when closing the settings
      if (!open && soundRef.current) {
        soundRef.current.stop();
        soundRef.current = null;
        setPlayingSound(null);
      }
    }}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-6 right-6 z-50 glass-dark text-white hover:bg-white/20 transition-all duration-300 animate-scale-in"
          aria-label="Open settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px] bg-black/90 backdrop-blur-xl border-white/10 text-white overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Clock Settings
          </SheetTitle>
          <SheetDescription className="text-white/70">
            Customize your clock appearance, position, and behavior
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Clock Mode Selection - NEW */}
          <Card className="glass-dark border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Activity className="h-4 w-4" />
                Clock Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={settings.clockMode} onValueChange={(value) => onSettingsChange({ clockMode: value as 'clock' | 'stopwatch' | 'timer' })}>
                <TabsList className="grid w-full grid-cols-3 bg-white/10">
                  <TabsTrigger value="clock" className="data-[state=active]:bg-white/20">
                    <Clock className="h-4 w-4 mr-2" />
                    Clock
                  </TabsTrigger>
                  <TabsTrigger value="stopwatch" className="data-[state=active]:bg-white/20">
                    <Activity className="h-4 w-4 mr-2" />
                    Stopwatch
                  </TabsTrigger>
                  <TabsTrigger value="timer" className="data-[state=active]:bg-white/20">
                    <Timer className="h-4 w-4 mr-2" />
                    Timer
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Clock Type (Digital/Analog) - NEW - Only show for clock mode */}
          {settings.clockMode === 'clock' && (
            <Card className="glass-dark border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <Clock className="h-4 w-4" />
                  Clock Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white/90 text-base font-medium">
                      Clock Face
                    </Label>
                    <p className="text-white/60 text-sm">
                      Choose between digital or analog display
                    </p>
                  </div>
                  <Select
                    value={settings.clockType}
                    onValueChange={(value) => onSettingsChange({ clockType: value as 'digital' | 'analog' })}
                  >
                    <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      <SelectItem value="digital" className="text-white hover:bg-white/10">Digital</SelectItem>
                      <SelectItem value="analog" className="text-white hover:bg-white/10">Analog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alarm Sound Settings - Only show for timer mode */}
          {settings.clockMode === 'timer' && (
            <Card className="glass-dark border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <Volume2 className="h-4 w-4" />
                  Timer Alarm Sound
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white/90">Alarm Sound</Label>
                    <div className="space-y-2">
                      {Object.entries(ALARM_SOUNDS).map(([value, { name, description }]) => (
                        <div 
                          key={value}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                            settings.alarmSound === value 
                              ? 'bg-white/20 border-white/30' 
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                          onClick={() => onSettingsChange({ alarmSound: value as AlarmSound })}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-white">{name}</div>
                            <div className="text-xs text-white/60">{description}</div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 ml-2 hover:bg-white/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaySound(value as AlarmSound);
                            }}
                          >
                            {playingSound === value ? (
                              <Square className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-white/50 bg-white/5 p-2 rounded">
                    💡 Click the play button to preview each sound (plays for 3 seconds)
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clock Position */}
          <Card className="glass-dark border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Move className="h-4 w-4" />
                Clock Position
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/90">
                  Vertical Position: {getPositionDescription(settings.topPadding)}
                </Label>
                <Slider
                  value={[settings.topPadding]}
                  onValueChange={([value]) => onSettingsChange({ topPadding: value })}
                  min={-200}
                  max={400}
                  step={10}
                  className="w-full"
                  aria-label="Clock vertical position"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>Higher (-200px)</span>
                  <span>Center (0px)</span>
                  <span>Lower (+400px)</span>
                </div>
              </div>
              <div className="text-xs text-white/50 bg-white/5 p-2 rounded">
                💡 Adjust the vertical position of the clock face. Negative values move it up, positive values move it down.
              </div>
            </CardContent>
          </Card>

          {/* Clock Size */}
          <Card className="glass-dark border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Type className="h-4 w-4" />
                Clock Size
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/90">Font Size: {settings.fontSize}px</Label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([value]) => onSettingsChange({ fontSize: value })}
                  min={24}
                  max={240}
                  step={4}
                  className="w-full"
                  aria-label="Clock font size"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>Small (24px)</span>
                  <span>Default (80px)</span>
                  <span>Extra Large (240px)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Display Settings - Only show for digital clock */}
          {settings.clockMode === 'clock' && settings.clockType === 'digital' && (
            <Card className="glass-dark border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <Clock className="h-4 w-4" />
                  Time Display
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Show Seconds Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white/90 text-base font-medium">
                      Show Seconds
                    </Label>
                    <p className="text-white/60 text-sm">
                      Display seconds in time format
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settings.showSeconds}
                      onCheckedChange={(checked) => onSettingsChange({ showSeconds: checked })}
                      aria-label="Toggle seconds display"
                      className="data-[state=checked]:bg-primary"
                    />
                    <span className="text-white/70 text-sm font-medium min-w-[32px]">
                      {settings.showSeconds ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* 24-Hour Format Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white/90 text-base font-medium">
                      24-Hour Format
                    </Label>
                    <p className="text-white/60 text-sm">
                      Use 24-hour time format
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settings.is24Hour}
                      onCheckedChange={(checked) => onSettingsChange({ is24Hour: checked })}
                      aria-label="Toggle 24-hour format"
                      className="data-[state=checked]:bg-primary"
                    />
                    <span className="text-white/70 text-sm font-medium min-w-[32px]">
                      {settings.is24Hour ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>

                {/* Time Preview */}
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <Label className="text-white/70 text-xs uppercase tracking-wide">
                    Preview
                  </Label>
                  <div className="text-white font-mono text-lg mt-1">
                    {getTimePreview()}
                  </div>
                </div>

              </CardContent>
            </Card>
          )}

          {/* Font Family */}
          <Card className="glass-dark border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Type className="h-4 w-4" />
                Font Family
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={settings.fontFamily}
                onValueChange={(value: FontFamily) => onSettingsChange({ fontFamily: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font.value} value={font.value} className="text-white hover:bg-white/10">
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Background Images - NEW SECTION */}
          <Card className="glass-dark border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <ImageIcon className="h-4 w-4" />
                Background Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BackgroundSelector
                settings={settings}
                onSettingsChange={onSettingsChange}
              />
            </CardContent>
          </Card>

          {/* Background Gradients */}
          {settings.backgroundType === 'gradient' && (
            <Card className="glass-dark border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <Palette className="h-4 w-4" />
                  Background Gradients
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/90">Gradient Preset</Label>
                  <Select
                    value={settings.backgroundGradient}
                    onValueChange={(value: GradientPreset) => onSettingsChange({ backgroundGradient: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      <SelectItem value="sunset" className="text-white hover:bg-white/10">Sunset</SelectItem>
                      <SelectItem value="ocean" className="text-white hover:bg-white/10">Ocean</SelectItem>
                      <SelectItem value="forest" className="text-white hover:bg-white/10">Forest</SelectItem>
                      <SelectItem value="purple" className="text-white hover:bg-white/10">Purple</SelectItem>
                      <SelectItem value="rose" className="text-white hover:bg-white/10">Rose</SelectItem>
                      <SelectItem value="midnight" className="text-white hover:bg-white/10">Midnight</SelectItem>
                      <SelectItem value="custom" className="text-white hover:bg-white/10">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.backgroundGradient === 'custom' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-white/90">Color 1</Label>
                      <Input
                        type="color"
                        value={settings.customColor1 || '#ff6b6b'}
                        onChange={(e) => onSettingsChange({ customColor1: e.target.value })}
                        className="h-10 bg-white/10 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/90">Color 2</Label>
                      <Input
                        type="color"
                        value={settings.customColor2 || '#4ecdc4'}
                        onChange={(e) => onSettingsChange({ customColor2: e.target.value })}
                        className="h-10 bg-white/10 border-white/20"
                      />
                    </div>
                  </div>
                )}

                {/* Preview */}
                <div className="space-y-2">
                  <Label className="text-white/90">Preview</Label>
                  <div 
                    className="h-16 rounded-lg border border-white/20"
                    style={getGradientStyle()}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Separator className="bg-white/20" />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/20"
            >
              Save Settings
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-black/90 border-white/20 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Reset Settings</AlertDialogTitle>
                  <AlertDialogDescription className="text-white/70">
                    This will reset all settings to their default values. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}