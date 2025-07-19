'use client';

import { useState, useEffect, useCallback } from 'react';
import { BackgroundImage, ClockSettings } from '@/types';
import { useBackgroundImages } from '@/hooks/useBackgroundImages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Image as ImageIcon, 
  Palette, 
  Star, 
  Camera, 
  AlertCircle,
  Check,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface BackgroundSelectorProps {
  settings: ClockSettings;
  onSettingsChange: (settings: Partial<ClockSettings>) => void;
}

export function BackgroundSelector({ settings, onSettingsChange }: BackgroundSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    settings.backgroundImageId || null
  );
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());
  
  const { 
    images, 
    loading, 
    error, 
    searchImages, 
    loadPopular, 
    loadDefaults,
    clearError 
  } = useBackgroundImages();
  
  const { toast } = useToast();

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchImages(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchImages]);

  const handleImageSelect = useCallback((image: BackgroundImage) => {
    setSelectedImageId(image.id);
    
    onSettingsChange({
      backgroundType: 'image',
      backgroundImage: image.url,
      backgroundImageId: image.id
    });

    toast({
      title: "Background Updated",
      description: `Set background to image by ${image.photographer}`,
    });
  }, [onSettingsChange, toast]);

  const handleGradientSelect = useCallback(() => {
    setSelectedImageId(null);
    
    onSettingsChange({
      backgroundType: 'gradient',
      backgroundImage: undefined,
      backgroundImageId: undefined
    });

    toast({
      title: "Background Updated",
      description: "Switched to gradient background",
    });
  }, [onSettingsChange, toast]);

  const handleImageError = useCallback((imageId: string) => {
    setImageLoadErrors(prev => new Set(prev).add(imageId));
  }, []);

  const handleRetry = useCallback(() => {
    clearError();
    setImageLoadErrors(new Set());
    
    if (searchQuery.trim()) {
      searchImages(searchQuery);
    } else {
      loadDefaults();
    }
  }, [clearError, searchQuery, searchImages, loadDefaults]);

  const filteredImages = images.filter(image => !imageLoadErrors.has(image.id));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/10">
          <TabsTrigger 
            value="images" 
            className="data-[state=active]:bg-white/20 text-white"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Images
          </TabsTrigger>
          <TabsTrigger 
            value="gradients" 
            className="data-[state=active]:bg-white/20 text-white"
          >
            <Palette className="h-4 w-4 mr-2" />
            Gradients
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="space-y-4 mt-4">
          {/* Search Controls */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                type="text"
                placeholder="Search for backgrounds (e.g., nature, mountains, ocean...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                disabled={loading}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadDefaults}
                disabled={loading}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Star className="h-3 w-3 mr-1" />
                Defaults
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadPopular}
                disabled={loading}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Camera className="h-3 w-3 mr-1" />
                Popular
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="bg-red-500/20 border-red-500/30 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="ml-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-white/70 mr-2" />
              <span className="text-white/70">Loading images...</span>
            </div>
          )}

          {/* Images Grid */}
          {!loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredImages.length > 0 ? (
                filteredImages.map((image) => (
                  <Card
                    key={image.id}
                    className={cn(
                      "relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 border-2",
                      selectedImageId === image.id
                        ? "border-primary ring-2 ring-primary/50"
                        : "border-white/20 hover:border-white/40"
                    )}
                    onClick={() => handleImageSelect(image)}
                  >
                    <CardContent className="p-0 relative aspect-video">
                      <img
                        src={image.thumbnail}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(image.id)}
                        loading="lazy"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        {selectedImageId === image.id && (
                          <div className="bg-primary rounded-full p-2">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Photographer Credit */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-xs truncate">
                            {image.photographer}
                          </span>
                          {image.isDefault && (
                            <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : !loading && (
                <div className="col-span-full text-center py-8 text-white/70">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No images found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video bg-white/10" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="gradients" className="mt-4">
          <div className="space-y-4">
            <Label className="text-white/90">Select Gradient Background</Label>
            
            <Button
              variant={settings.backgroundType === 'gradient' ? 'default' : 'outline'}
              onClick={handleGradientSelect}
              className={cn(
                "w-full justify-start",
                settings.backgroundType === 'gradient'
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              )}
            >
              <Palette className="h-4 w-4 mr-2" />
              Use Gradient Background
              {settings.backgroundType === 'gradient' && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </Button>

            <div className="text-xs text-white/60 bg-white/5 p-3 rounded-lg">
              <p className="mb-2">
                <strong>💡 Tip:</strong> Gradient backgrounds provide better text readability and faster loading times.
              </p>
              <p>
                You can customize gradient colors in the "Background" section above.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
