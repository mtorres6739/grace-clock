import { CityTimezone } from '@/types';

export const CITY_TIMEZONES: CityTimezone[] = [
  // North America
  { city: 'New York', timezone: 'America/New_York', country: 'USA', continent: 'North America' },
  { city: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'USA', continent: 'North America' },
  { city: 'Chicago', timezone: 'America/Chicago', country: 'USA', continent: 'North America' },
  { city: 'Toronto', timezone: 'America/Toronto', country: 'Canada', continent: 'North America' },
  { city: 'Vancouver', timezone: 'America/Vancouver', country: 'Canada', continent: 'North America' },
  { city: 'Mexico City', timezone: 'America/Mexico_City', country: 'Mexico', continent: 'North America' },
  { city: 'Denver', timezone: 'America/Denver', country: 'USA', continent: 'North America' },
  { city: 'Phoenix', timezone: 'America/Phoenix', country: 'USA', continent: 'North America' },
  
  // South America
  { city: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'Brazil', continent: 'South America' },
  { city: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', country: 'Argentina', continent: 'South America' },
  { city: 'Lima', timezone: 'America/Lima', country: 'Peru', continent: 'South America' },
  { city: 'Bogotá', timezone: 'America/Bogota', country: 'Colombia', continent: 'South America' },
  { city: 'Santiago', timezone: 'America/Santiago', country: 'Chile', continent: 'South America' },
  
  // Europe
  { city: 'London', timezone: 'Europe/London', country: 'UK', continent: 'Europe' },
  { city: 'Paris', timezone: 'Europe/Paris', country: 'France', continent: 'Europe' },
  { city: 'Berlin', timezone: 'Europe/Berlin', country: 'Germany', continent: 'Europe' },
  { city: 'Madrid', timezone: 'Europe/Madrid', country: 'Spain', continent: 'Europe' },
  { city: 'Rome', timezone: 'Europe/Rome', country: 'Italy', continent: 'Europe' },
  { city: 'Amsterdam', timezone: 'Europe/Amsterdam', country: 'Netherlands', continent: 'Europe' },
  { city: 'Brussels', timezone: 'Europe/Brussels', country: 'Belgium', continent: 'Europe' },
  { city: 'Vienna', timezone: 'Europe/Vienna', country: 'Austria', continent: 'Europe' },
  { city: 'Prague', timezone: 'Europe/Prague', country: 'Czech Republic', continent: 'Europe' },
  { city: 'Warsaw', timezone: 'Europe/Warsaw', country: 'Poland', continent: 'Europe' },
  { city: 'Stockholm', timezone: 'Europe/Stockholm', country: 'Sweden', continent: 'Europe' },
  { city: 'Athens', timezone: 'Europe/Athens', country: 'Greece', continent: 'Europe' },
  { city: 'Helsinki', timezone: 'Europe/Helsinki', country: 'Finland', continent: 'Europe' },
  { city: 'Lisbon', timezone: 'Europe/Lisbon', country: 'Portugal', continent: 'Europe' },
  { city: 'Dublin', timezone: 'Europe/Dublin', country: 'Ireland', continent: 'Europe' },
  { city: 'Zurich', timezone: 'Europe/Zurich', country: 'Switzerland', continent: 'Europe' },
  
  // Asia
  { city: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan', continent: 'Asia' },
  { city: 'Beijing', timezone: 'Asia/Shanghai', country: 'China', continent: 'Asia' },
  { city: 'Shanghai', timezone: 'Asia/Shanghai', country: 'China', continent: 'Asia' },
  { city: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'China', continent: 'Asia' },
  { city: 'Singapore', timezone: 'Asia/Singapore', country: 'Singapore', continent: 'Asia' },
  { city: 'Seoul', timezone: 'Asia/Seoul', country: 'South Korea', continent: 'Asia' },
  { city: 'Mumbai', timezone: 'Asia/Kolkata', country: 'India', continent: 'Asia' },
  { city: 'New Delhi', timezone: 'Asia/Kolkata', country: 'India', continent: 'Asia' },
  { city: 'Bangkok', timezone: 'Asia/Bangkok', country: 'Thailand', continent: 'Asia' },
  { city: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE', continent: 'Asia' },
  { city: 'Istanbul', timezone: 'Europe/Istanbul', country: 'Turkey', continent: 'Asia' },
  { city: 'Jakarta', timezone: 'Asia/Jakarta', country: 'Indonesia', continent: 'Asia' },
  { city: 'Manila', timezone: 'Asia/Manila', country: 'Philippines', continent: 'Asia' },
  { city: 'Taipei', timezone: 'Asia/Taipei', country: 'Taiwan', continent: 'Asia' },
  { city: 'Kuala Lumpur', timezone: 'Asia/Kuala_Lumpur', country: 'Malaysia', continent: 'Asia' },
  { city: 'Tel Aviv', timezone: 'Asia/Jerusalem', country: 'Israel', continent: 'Asia' },
  { city: 'Riyadh', timezone: 'Asia/Riyadh', country: 'Saudi Arabia', continent: 'Asia' },
  
  // Africa
  { city: 'Cairo', timezone: 'Africa/Cairo', country: 'Egypt', continent: 'Africa' },
  { city: 'Johannesburg', timezone: 'Africa/Johannesburg', country: 'South Africa', continent: 'Africa' },
  { city: 'Lagos', timezone: 'Africa/Lagos', country: 'Nigeria', continent: 'Africa' },
  { city: 'Nairobi', timezone: 'Africa/Nairobi', country: 'Kenya', continent: 'Africa' },
  { city: 'Casablanca', timezone: 'Africa/Casablanca', country: 'Morocco', continent: 'Africa' },
  
  // Oceania
  { city: 'Sydney', timezone: 'Australia/Sydney', country: 'Australia', continent: 'Oceania' },
  { city: 'Melbourne', timezone: 'Australia/Melbourne', country: 'Australia', continent: 'Oceania' },
  { city: 'Auckland', timezone: 'Pacific/Auckland', country: 'New Zealand', continent: 'Oceania' },
  { city: 'Perth', timezone: 'Australia/Perth', country: 'Australia', continent: 'Oceania' },
  { city: 'Brisbane', timezone: 'Australia/Brisbane', country: 'Australia', continent: 'Oceania' },
];

// Helper function to get user's timezone
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Helper function to format timezone offset
export function getTimezoneOffset(timezone: string): string {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short'
  });
  
  const parts = formatter.formatToParts(date);
  const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value || '';
  
  // Extract offset from timezone name (e.g., "GMT-5" -> "-5")
  const offsetMatch = timeZoneName.match(/GMT([+-]\d+)/);
  if (offsetMatch) {
    return `UTC${offsetMatch[1]}`;
  }
  
  return timeZoneName;
}