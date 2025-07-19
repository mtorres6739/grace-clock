'use client';

import { useState, useEffect, useCallback } from 'react';
import { BackgroundImage } from '@/types';
import { pexelsService } from '@/lib/pexels';

interface UseBackgroundImagesReturn {
  images: BackgroundImage[];
  loading: boolean;
  error: string | null;
  searchImages: (query: string) => Promise<void>;
  loadPopular: () => Promise<void>;
  loadDefaults: () => void;
  clearError: () => void;
}

export function useBackgroundImages(): UseBackgroundImagesReturn {
  const [images, setImages] = useState<BackgroundImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load default images on mount
  useEffect(() => {
    loadDefaults();
  }, []);

  const loadDefaults = useCallback(() => {
    setLoading(true);
    setError(null);
    
    try {
      const defaultImages = pexelsService.getDefaultImages();
      setImages(defaultImages);
    } catch (err) {
      setError('Failed to load default images');
      console.error('Error loading default images:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchImages = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadDefaults();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResults = await pexelsService.searchImages(query.trim(), 1, 12);
      setImages(searchResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search images';
      setError(errorMessage);
      console.error('Error searching images:', err);
      
      // Fallback to defaults on error
      loadDefaults();
    } finally {
      setLoading(false);
    }
  }, [loadDefaults]);

  const loadPopular = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const popularImages = await pexelsService.getPopularImages(1, 12);
      setImages(popularImages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load popular images';
      setError(errorMessage);
      console.error('Error loading popular images:', err);
      
      // Fallback to defaults on error
      loadDefaults();
    } finally {
      setLoading(false);
    }
  }, [loadDefaults]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    images,
    loading,
    error,
    searchImages,
    loadPopular,
    loadDefaults,
    clearError
  };
}
