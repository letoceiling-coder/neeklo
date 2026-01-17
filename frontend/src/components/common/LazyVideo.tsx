import { useEffect, useRef, useState, useCallback } from 'react';
import { useMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  showLoadingState?: boolean;
}

export const LazyVideo = ({
  src,
  poster,
  className = '',
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  showLoadingState = true,
}: LazyVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isMobile = useMobile();

  // Handle video loaded
  const handleLoaded = useCallback(() => {
    // Small delay to ensure smooth transition
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });
  }, []);

  // Handle video error
  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true); // Hide loading state on error
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Intersection Observer for lazy loading with larger margin for preloading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px 0px', // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // Load video when in view
  useEffect(() => {
    if (!isInView || !videoRef.current) return;

    const video = videoRef.current;
    
    // Set source and load
    if (!video.src) {
      video.src = src;
      video.load();
    }

    // Don't autoplay on mobile to save bandwidth
    if (isMobile && autoPlay) {
      video.autoplay = false;
    }
  }, [isInView, src, autoPlay, isMobile]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Loading placeholder */}
      {showLoadingState && !isLoaded && (
        <div className="absolute inset-0 bg-surface animate-pulse flex items-center justify-center transition-opacity duration-300">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      
      {/* Video element */}
      <video
        ref={videoRef}
        poster={poster}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        autoPlay={!isMobile && autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload="metadata"
        onLoadedData={handleLoaded}
        onCanPlayThrough={handleLoaded}
        onError={handleError}
      >
        {/* Source is set dynamically when in view */}
      </video>
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-surface flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Видео недоступно</span>
        </div>
      )}
    </div>
  );
};
