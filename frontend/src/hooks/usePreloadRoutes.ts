import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { scheduleIdleWork } from '@/lib/performance';

// All product page imports for preloading
const productImports = {
  'ai-agent': () => import('@/pages/products/AIAgent'),
  'telegram-bot': () => import('@/pages/products/TelegramBot'),
  'mini-app': () => import('@/pages/products/MiniApp'),
  'website': () => import('@/pages/products/Website'),
  'ai-video': () => import('@/pages/products/AIVideo'),
  'automation': () => import('@/pages/products/Automation'),
  'ecosystem': () => import('@/pages/products/Ecosystem'),
  'branding': () => import('@/pages/products/Branding'),
  'crm': () => import('@/pages/products/CRM'),
  'mobile-app': () => import('@/pages/products/MobileApp'),
  'support': () => import('@/pages/products/Support'),
  'consulting': () => import('@/pages/products/Consulting'),
};

// Route preload configuration with smart prioritization
const routePreloads: Record<string, Array<() => Promise<unknown>>> = {
  '/': [
    () => import('@/pages/Services'),
    () => import('@/pages/Contact'),
    productImports['ai-agent'],
    productImports['website'],
    productImports['telegram-bot'],
  ],
  '/services': [
    () => import('@/pages/Services'),
    ...Object.values(productImports),
  ],
  '/cases': [
    () => import('@/pages/WorkDetail'),
  ],
};

export function usePreloadRoutes() {
  const location = useLocation();
  const preloadedRef = useRef<Set<string>>(new Set());

  // Preload on hover for product links
  const preloadProduct = useCallback((slug: string) => {
    const importer = productImports[slug as keyof typeof productImports];
    if (importer) {
      importer().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Don't preload the same routes twice
    if (preloadedRef.current.has(currentPath)) return;
    preloadedRef.current.add(currentPath);

    // Use idle callback to avoid blocking main thread
    scheduleIdleWork(() => {
      const preloads = routePreloads[currentPath];
      if (preloads) {
        preloads.forEach(load => {
          load().catch(() => {
            // Silently fail - preloading is optional
          });
        });
      }
    }, 500); // Reduced timeout for faster preloading
  }, [location.pathname]);

  // Add hover listeners for product links
  useEffect(() => {
    const handleLinkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="/products/"]');
      if (link) {
        const href = link.getAttribute('href');
        if (href) {
          const slug = href.replace('/products/', '');
          preloadProduct(slug);
        }
      }
    };

    document.addEventListener('mouseover', handleLinkHover, { passive: true });
    return () => document.removeEventListener('mouseover', handleLinkHover);
  }, [preloadProduct]);
}
