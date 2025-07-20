'use client';

import { useState, useEffect, useCallback } from 'react';
import { BibleVerse, BibleVersion } from '@/types';
import { bibleService } from '@/lib/bible-service';

const FALLBACK_VERSES: BibleVerse[] = [
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
  },
  {
    text: "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13",
    book: "Philippians",
    chapter: 4,
    verse: 13
  },
  {
    text: "The Lord is my shepherd, I lack nothing.",
    reference: "Psalm 23:1",
    book: "Psalm",
    chapter: 23,
    verse: 1
  },
  {
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9",
    book: "Joshua",
    chapter: 1,
    verse: 9
  }
];

export function useBibleVerse(version: BibleVersion = 'NIV') {
  const [verse, setVerse] = useState<BibleVerse>(FALLBACK_VERSES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRandomFallbackVerse = () => {
    return FALLBACK_VERSES[Math.floor(Math.random() * FALLBACK_VERSES.length)];
  };

  const fetchVerse = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newVerse = await bibleService.getVerseOfTheDay(version);
      setVerse(newVerse);
    } catch (err) {
      console.error('Error fetching Bible verse:', err);
      setError('Unable to fetch verse');
      setVerse(getRandomFallbackVerse());
    } finally {
      setIsLoading(false);
    }
  }, [version]);

  const refreshVerse = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newVerse = await bibleService.getRandomVerse(version);
      setVerse(newVerse);
    } catch (err) {
      console.error('Error fetching Bible verse:', err);
      setError('Unable to fetch verse');
      setVerse(getRandomFallbackVerse());
    } finally {
      setIsLoading(false);
    }
  }, [version]);

  useEffect(() => {
    // Check if we have a cached verse for today
    const today = new Date().toDateString();
    const cachedData = localStorage.getItem('dailyVerse');
    
    if (cachedData) {
      try {
        const { date, verse: cachedVerse } = JSON.parse(cachedData);
        if (date === today && cachedVerse) {
          setVerse(cachedVerse);
          return;
        }
      } catch (error) {
        console.error('Error parsing cached verse:', error);
      }
    }

    // Fetch new verse
    fetchVerse();
  }, [fetchVerse]);

  useEffect(() => {
    // Cache the current verse
    const today = new Date().toDateString();
    try {
      localStorage.setItem('dailyVerse', JSON.stringify({
        date: today,
        verse
      }));
    } catch (error) {
      console.error('Error caching verse:', error);
    }
  }, [verse]);

  return {
    verse,
    isLoading,
    error,
    refreshVerse
  };
}
