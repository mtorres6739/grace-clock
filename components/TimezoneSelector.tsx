'use client';

import { useState } from 'react';
import { CITY_TIMEZONES, getUserTimezone } from '@/data/timezones';
import { TimezoneDisplay } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TimezoneSelectorProps {
  primaryTimezone: string;
  additionalTimezones: TimezoneDisplay[];
  timezoneDisplayMode: 'city' | 'timezone' | 'both';
  maxTimezonesDisplayed: number;
  onPrimaryTimezoneChange: (timezone: string) => void;
  onAdditionalTimezonesChange: (timezones: TimezoneDisplay[]) => void;
  onDisplayModeChange: (mode: 'city' | 'timezone' | 'both') => void;
  onMaxTimezonesChange: (max: number) => void;
}

export function TimezoneSelector({
  primaryTimezone,
  additionalTimezones,
  timezoneDisplayMode,
  maxTimezonesDisplayed,
  onPrimaryTimezoneChange,
  onAdditionalTimezonesChange,
  onDisplayModeChange,
  onMaxTimezonesChange
}: TimezoneSelectorProps) {
  const [selectedCity, setSelectedCity] = useState('');

  // Group cities by continent
  const citiesByContinent = CITY_TIMEZONES.reduce((acc, city) => {
    if (!acc[city.continent]) {
      acc[city.continent] = [];
    }
    acc[city.continent].push(city);
    return acc;
  }, {} as Record<string, typeof CITY_TIMEZONES>);

  const handleAddTimezone = () => {
    if (!selectedCity) return;
    
    const city = CITY_TIMEZONES.find(c => c.city === selectedCity);
    if (!city) return;

    const newTimezone: TimezoneDisplay = {
      id: Date.now().toString(),
      city: city.city,
      timezone: city.timezone,
      enabled: true
    };

    onAdditionalTimezonesChange([...additionalTimezones, newTimezone]);
    setSelectedCity('');
  };

  const handleToggleTimezone = (id: string) => {
    const updated = additionalTimezones.map(tz =>
      tz.id === id ? { ...tz, enabled: !tz.enabled } : tz
    );
    onAdditionalTimezonesChange(updated);
  };

  const handleRemoveTimezone = (id: string) => {
    onAdditionalTimezonesChange(additionalTimezones.filter(tz => tz.id !== id));
  };

  const userTimezone = getUserTimezone();
  const userCity = CITY_TIMEZONES.find(c => c.timezone === userTimezone)?.city || 'Local';

  return (
    <div className="space-y-6">
      {/* Primary Timezone */}
      <div>
        <Label className="text-sm font-medium mb-2 flex items-center gap-2 text-white/90">
          <Globe className="w-4 h-4" />
          Primary Timezone
        </Label>
        <Select value={primaryTimezone} onValueChange={onPrimaryTimezoneChange}>
          <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-white/20">
            <SelectItem value={userTimezone} className="text-white hover:bg-white/10">
              {userCity} (Local)
            </SelectItem>
            {Object.entries(citiesByContinent).map(([continent, cities]) => (
              <SelectGroup key={continent}>
                <SelectLabel className="text-white/60">{continent}</SelectLabel>
                {cities.map(city => (
                  <SelectItem key={city.timezone} value={city.timezone} className="text-white hover:bg-white/10">
                    {city.city}, {city.country}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Additional Timezones */}
      <div>
        <Label className="text-sm font-medium mb-2 text-white/90">Additional Timezones</Label>
        
        <div className="space-y-2 mb-4">
          {additionalTimezones.map(tz => (
            <Card key={tz.id} className="p-3 bg-white/5 border-white/10">
              <CardContent className="p-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={tz.enabled}
                    onCheckedChange={() => handleToggleTimezone(tz.id)}
                  />
                  <span className="text-sm text-white/90">{tz.city}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveTimezone(tz.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="flex-1 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/20">
              {Object.entries(citiesByContinent).map(([continent, cities]) => (
                <SelectGroup key={continent}>
                  <SelectLabel className="text-white/60">{continent}</SelectLabel>
                  {cities
                    .filter(city => !additionalTimezones.some(tz => tz.city === city.city))
                    .map(city => (
                      <SelectItem key={city.city} value={city.city} className="text-white hover:bg-white/10">
                        {city.city}, {city.country}
                      </SelectItem>
                    ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAddTimezone}
            disabled={!selectedCity}
            size="icon"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Display Mode */}
      <div>
        <Label className="text-sm font-medium mb-2 text-white/90">Display Mode</Label>
        <RadioGroup value={timezoneDisplayMode} onValueChange={onDisplayModeChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="city" id="city" />
            <Label htmlFor="city" className="text-sm font-normal cursor-pointer text-white/80">City name only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="timezone" id="timezone" />
            <Label htmlFor="timezone" className="text-sm font-normal cursor-pointer text-white/80">Timezone only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both" className="text-sm font-normal cursor-pointer text-white/80">Both city and timezone</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Max Timezones Displayed */}
      <div>
        <Label className="text-sm font-medium mb-2 text-white/90">
          Maximum Timezones Displayed: {maxTimezonesDisplayed}
        </Label>
        <Slider
          value={[maxTimezonesDisplayed]}
          onValueChange={([value]) => onMaxTimezonesChange(value)}
          min={1}
          max={8}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
}