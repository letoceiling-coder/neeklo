import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyImageOptions {
  src: string;
  priority?: boolean;
  rootMargin?: string;
  threshold?: number;
}

interface UseLazyImageReturn {
  isLoaded: boolean;
  isInView: boolean;
  imgRef: React.RefObject<HTMLImageElement>;
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Hook for lazy loading images with IntersectionObserver
 * Optimized for LCP by supporting priority images
 */
export function useLazyImage({
  src,
  priority = false,
  rootMargin = '200px',
  threshold = 0.01
}: UseLazyImageOptions): UseLazyImageReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset loaded state when src changes
  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView, rootMargin, threshold]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Attach load event listener
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !isInView) return;

    if (img.complete) {
      setIsLoaded(true);
    } else {
      img.addEventListener('load', handleLoad);
      return () => img.removeEventListener('load', handleLoad);
    }
  }, [isInView, handleLoad]);

  return {
    isLoaded,
    isInView,
    imgRef,
    containerRef
  };
}
