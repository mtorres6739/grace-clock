'use client';

import { useBibleVerse } from '@/hooks/useBibleVerse';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function BibleVerseCard() {
  const { verse, isLoading, error, refreshVerse } = useBibleVerse();

  return (
    <Card className="glass-dark rounded-2xl border-white/10 animate-slide-up">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-white/70" />
            <span className="text-white/70 font-medium">Daily Verse</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshVerse}
            disabled={isLoading}
            className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Refresh Bible verse"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-3/4 bg-white/10" />
            <Skeleton className="h-4 w-1/2 bg-white/10" />
          </div>
        ) : error ? (
          <div className="text-red-400 text-sm">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            <blockquote className="text-white/90 text-lg leading-relaxed italic">
              "{verse.text}"
            </blockquote>
            <cite className="text-white/70 font-medium not-italic">
              — {verse.reference}
            </cite>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
