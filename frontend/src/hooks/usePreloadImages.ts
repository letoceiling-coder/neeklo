import { useEffect } from 'react';
import { preloadCriticalImages } from '@/lib/performance';

// Critical images that should be preloaded for LCP
const CRITICAL_IMAGES: string[] = [
  // Add your above-the-fold images here
  // Example: '/images/hero.webp'
];

/**
 * Hook to preload critical images for improved LCP
 * Should be called once at app initialization
 */
export function usePreloadImages(additionalImages: string[] = []) {
  useEffect(() => {
    // Combine default critical images with any additional ones
    const imagesToPreload = [...CRITICAL_IMAGES, ...additionalImages];
    
    if (imagesToPreload.length > 0) {
      preloadCriticalImages(imagesToPreload);
    }
  }, []);
}
