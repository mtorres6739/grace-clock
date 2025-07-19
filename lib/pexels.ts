import { PexelsSearchResponse, PexelsPhoto, PexelsError, BackgroundImage } from '@/types';

// Default nature images as fallback
export const DEFAULT_NATURE_IMAGES: BackgroundImage[] = [
  {
    id: 'default-1',
    url: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    photographer: 'James Wheeler',
    alt: 'Beautiful mountain landscape at sunset',
    isDefault: true
  },
  {
    id: 'default-2',
    url: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    photographer: 'Luis del Río',
    alt: 'Serene forest with sunlight streaming through trees',
    isDefault: true
  },
  {
    id: 'default-3',
    url: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    photographer: 'Oliver Sjöström',
    alt: 'Peaceful ocean waves at golden hour',
    isDefault: true
  },
  {
    id: 'default-4',
    url: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    photographer: 'Simon Berger',
    alt: 'Majestic snow-capped mountain peaks',
    isDefault: true
  },
  {
    id: 'default-5',
    url: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    photographer: 'Johannes Plenio',
    alt: 'Vibrant flower field in spring',
    isDefault: true
  },
  {
    id: 'default-6',
    url: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    photographer: 'Tobias Bjørkli',
    alt: 'Dramatic aurora borealis over snowy landscape',
    isDefault: true
  }
];

class PexelsService {
  private apiKey: string;
  private baseUrl = 'https://api.pexels.com/v1';
  private cache = new Map<string, { data: BackgroundImage[]; timestamp: number }>();
  private cacheTimeout = 10 * 60 * 1000; // 10 minutes
  private rateLimitDelay = 1000; // 1 second between requests
  private lastRequestTime = 0;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Pexels API key not found. Using default images only.');
    }
  }

  private async makeRequest(url: string): Promise<Response> {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();

    const response = await fetch(url, {
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData: PexelsError = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`
      }));
      
      throw new Error(errorData.message || errorData.error || 'Failed to fetch from Pexels API');
    }

    return response;
  }

  private transformPexelsPhoto(photo: PexelsPhoto): BackgroundImage {
    return {
      id: photo.id.toString(),
      url: photo.src.large2x || photo.src.large,
      thumbnail: photo.src.medium,
      photographer: photo.photographer,
      alt: photo.alt || 'Beautiful background image',
      isDefault: false
    };
  }

  private getCacheKey(query: string, page: number): string {
    return `${query}-${page}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  async searchImages(
    query: string, 
    page: number = 1, 
    perPage: number = 12
  ): Promise<BackgroundImage[]> {
    // Return default images if no API key
    if (!this.apiKey) {
      console.warn('No Pexels API key available. Returning default images.');
      return DEFAULT_NATURE_IMAGES;
    }

    const cacheKey = this.getCacheKey(query, page);
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if valid
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=landscape`;
      const response = await this.makeRequest(url);
      const data: PexelsSearchResponse = await response.json();
      
      const images = data.photos.map(photo => this.transformPexelsPhoto(photo));
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: images,
        timestamp: Date.now()
      });
      
      return images;
    } catch (error) {
      console.error('Pexels API error:', error);
      
      // Return default images on error
      if (query.toLowerCase().includes('nature') || 
          query.toLowerCase().includes('landscape') || 
          query.toLowerCase().includes('mountain') ||
          query.toLowerCase().includes('forest')) {
        return DEFAULT_NATURE_IMAGES;
      }
      
      throw new Error(
        error instanceof Error 
          ? `Failed to search images: ${error.message}`
          : 'Failed to search images'
      );
    }
  }

  async getPopularImages(page: number = 1, perPage: number = 12): Promise<BackgroundImage[]> {
    if (!this.apiKey) {
      return DEFAULT_NATURE_IMAGES;
    }

    const cacheKey = `popular-${page}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}/curated?page=${page}&per_page=${perPage}`;
      const response = await this.makeRequest(url);
      const data: PexelsSearchResponse = await response.json();
      
      const images = data.photos.map(photo => this.transformPexelsPhoto(photo));
      
      this.cache.set(cacheKey, {
        data: images,
        timestamp: Date.now()
      });
      
      return images;
    } catch (error) {
      console.error('Pexels API error:', error);
      return DEFAULT_NATURE_IMAGES;
    }
  }

  getDefaultImages(): BackgroundImage[] {
    return DEFAULT_NATURE_IMAGES;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const pexelsService = new PexelsService();
