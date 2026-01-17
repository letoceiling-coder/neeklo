// Performance utilities for the app

type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Request idle callback with fallback for Safari
 */
export function scheduleIdleWork(callback: () => void, timeout = 1000): number {
  const win = typeof window !== 'undefined' ? window as WindowWithIdleCallback : null;
  if (!win) return 0;
  
  if (win.requestIdleCallback) {
    return win.requestIdleCallback(callback, { timeout });
  }
  return Number(setTimeout(callback, 1));
}

/**
 * Cancel idle callback with fallback
 */
export function cancelIdleWork(id: number): void {
  const win = typeof window !== 'undefined' ? window as WindowWithIdleCallback : null;
  if (!win) return;
  
  if (win.cancelIdleCallback) {
    win.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Prefetch a route by preloading its chunk
 */
export function prefetchRoute(importFn: () => Promise<unknown>): void {
  scheduleIdleWork(() => {
    importFn().catch(() => {
      // Silent fail - prefetching is optional
    });
  });
}

/**
 * Preload an image with priority
 */
export function preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    // Use fetchPriority for critical images
    if (priority === 'high') {
      (img as any).fetchPriority = 'high';
    }
    img.src = src;
  });
}

/**
 * Preload multiple images in parallel
 */
export function preloadImages(sources: string[], priority: 'high' | 'low' = 'low'): Promise<void[]> {
  return Promise.all(sources.map(src => preloadImage(src, priority)));
}

/**
 * Preload critical images using link preload
 * Call this in useEffect or at app initialization
 */
export function preloadCriticalImages(sources: string[]): void {
  if (typeof document === 'undefined') return;
  
  sources.forEach(src => {
    // Check if already preloaded
    const existing = document.querySelector(`link[href="${src}"]`);
    if (existing) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
}

/**
 * Create an IntersectionObserver for lazy loading with optimized settings
 */
export function createLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    },
    {
      rootMargin: '200px 0px', // Start loading 200px before viewport
      threshold: 0.01,
      ...options
    }
  );
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Throttle function for scroll handlers
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  } as T;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  } as T;
}
