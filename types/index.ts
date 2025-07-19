export interface ClockSettings {
  fontSize: number;
  fontFamily: string;
  showSeconds: boolean;
  is24Hour: boolean;
  backgroundGradient: string;
  customColor1?: string;
  customColor2?: string;
  topPadding: number;
  // NEW: Background image settings
  backgroundType: 'gradient' | 'image';
  backgroundImage?: string;
  backgroundImageId?: string;
  // NEW: Clock type and mode settings
  clockType: 'digital' | 'analog';
  clockMode: 'clock' | 'stopwatch' | 'timer';
  // NEW: Alarm sound settings
  alarmSound: 'alarm1' | 'alarm2' | 'alarm3' | 'alarm4' | 'alarm5' | 'alarm6';
}

export interface BibleVerse {
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
}

export interface ApiResponse {
  reference: string;
  verses: Array<{
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

// NEW: Pexels API Types
export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
  prev_page?: string;
}

export interface PexelsError {
  error: string;
  message?: string;
}

export interface BackgroundImage {
  id: string;
  url: string;
  thumbnail: string;
  photographer: string;
  alt: string;
  isDefault?: boolean;
}

export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'playfair' | 'montserrat';

export type GradientPreset = 
  | 'sunset'
  | 'ocean'
  | 'forest'
  | 'purple'
  | 'rose'
  | 'midnight'
  | 'custom';