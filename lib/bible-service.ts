import { BibleVerse, BibleVersion, BibleVersionInfo } from '@/types';

export const BIBLE_VERSIONS: BibleVersionInfo[] = [
  { code: 'KJV', name: 'KJV', fullName: 'King James Version' },
  { code: 'NKJV', name: 'NKJV', fullName: 'New King James Version' },
  { code: 'NIV', name: 'NIV', fullName: 'New International Version' },
  { code: 'ESV', name: 'ESV', fullName: 'English Standard Version' },
  { code: 'NLT', name: 'NLT', fullName: 'New Living Translation' }
];

// Popular verses for random selection
const POPULAR_VERSES = [
  'John 3:16',
  'Philippians 4:13',
  'Jeremiah 29:11',
  'Proverbs 3:5-6',
  'Psalm 23:1',
  'Romans 8:28',
  'Isaiah 40:31',
  'Matthew 11:28',
  'Psalm 46:10',
  'Joshua 1:9',
  '2 Timothy 1:7',
  '1 Corinthians 13:4',
  'Hebrews 11:1',
  'Psalm 119:105',
  'Matthew 6:33'
];

// Version-specific fallback verses
const FALLBACK_VERSES: Record<BibleVersion, BibleVerse[]> = {
  KJV: [
    {
      text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      reference: "John 3:16",
      book: "John",
      chapter: 3,
      verse: 16
    },
    {
      text: "Trust in the Lord with all thine heart; and lean not unto thine own understanding.",
      reference: "Proverbs 3:5",
      book: "Proverbs",
      chapter: 3,
      verse: 5
    }
  ],
  NKJV: [
    {
      text: "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.",
      reference: "John 3:16",
      book: "John",
      chapter: 3,
      verse: 16
    },
    {
      text: "Trust in the Lord with all your heart, And lean not on your own understanding.",
      reference: "Proverbs 3:5",
      book: "Proverbs",
      chapter: 3,
      verse: 5
    }
  ],
  NIV: [
    {
      text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      reference: "John 3:16",
      book: "John",
      chapter: 3,
      verse: 16
    },
    {
      text: "Trust in the Lord with all your heart and lean not on your own understanding.",
      reference: "Proverbs 3:5",
      book: "Proverbs",
      chapter: 3,
      verse: 5
    }
  ],
  ESV: [
    {
      text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
      reference: "John 3:16",
      book: "John",
      chapter: 3,
      verse: 16
    },
    {
      text: "Trust in the Lord with all your heart, and do not lean on your own understanding.",
      reference: "Proverbs 3:5",
      book: "Proverbs",
      chapter: 3,
      verse: 5
    }
  ],
  NLT: [
    {
      text: "For this is how God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.",
      reference: "John 3:16",
      book: "John",
      chapter: 3,
      verse: 16
    },
    {
      text: "Trust in the Lord with all your heart; do not depend on your own understanding.",
      reference: "Proverbs 3:5",
      book: "Proverbs",
      chapter: 3,
      verse: 5
    }
  ]
};

class BibleService {
  private apiBaseUrl = 'https://bible-api.com';
  private cache = new Map<string, { data: BibleVerse; timestamp: number }>();
  private cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours

  async fetchVerse(reference: string, version: BibleVersion): Promise<BibleVerse> {
    const cacheKey = `${reference}-${version}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // The Bible API uses translation parameter for versions
      const translationParam = this.getTranslationParam(version);
      const url = `${this.apiBaseUrl}/${encodeURIComponent(reference)}?translation=${translationParam}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to fetch verse');
      }

      const data = await response.json();
      
      if (data && data.text && data.reference) {
        const verse: BibleVerse = {
          text: data.text.trim().replace(/\s+/g, ' '),
          reference: data.reference,
          book: data.verses?.[0]?.book_name || reference.split(' ')[0],
          chapter: data.verses?.[0]?.chapter || parseInt(reference.split(' ')[1]),
          verse: data.verses?.[0]?.verse || parseInt(reference.split(':')[1])
        };
        
        this.cache.set(cacheKey, {
          data: verse,
          timestamp: Date.now()
        });
        
        return verse;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      return this.getFallbackVerse(reference, version);
    }
  }

  private getTranslationParam(version: BibleVersion): string {
    // The Bible API uses specific translation codes
    const translationMap: Record<BibleVersion, string> = {
      KJV: 'kjv',
      NKJV: 'nkjv',
      NIV: 'niv',
      ESV: 'esv',
      NLT: 'nlt'
    };
    
    return translationMap[version] || 'kjv';
  }

  private getFallbackVerse(reference: string, version: BibleVersion): BibleVerse {
    const fallbacks = FALLBACK_VERSES[version] || FALLBACK_VERSES.KJV;
    
    // Try to find a matching reference
    const matched = fallbacks.find(v => v.reference === reference);
    if (matched) return matched;
    
    // Return a random fallback
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  getRandomVerse(version: BibleVersion): Promise<BibleVerse> {
    const randomReference = POPULAR_VERSES[Math.floor(Math.random() * POPULAR_VERSES.length)];
    return this.fetchVerse(randomReference, version);
  }

  getVerseOfTheDay(version: BibleVersion): Promise<BibleVerse> {
    // Generate a consistent daily verse based on the date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const verseIndex = dayOfYear % POPULAR_VERSES.length;
    
    return this.fetchVerse(POPULAR_VERSES[verseIndex], version);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const bibleService = new BibleService();