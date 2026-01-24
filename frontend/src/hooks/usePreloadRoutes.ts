import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { scheduleIdleWork } from '@/lib/performance';

// Product page imports for preloading (main nav: Services, Work, About, Contact, Process — в main bundle)
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

// Route preload: Services/Work/About/Contact/Process — в main bundle, остальное подгружаем
const routePreloads: Record<string, Array<() => Promise<unknown>>> = {
  '/': [
    productImports['ai-agent'],
    productImports['website'],
    productImports['telegram-bot'],
  ],
  '/services': [...Object.values(productImports)],
  '/work': [() => import('@/pages/WorkDetail')],
  '/cases': [() => import('@/pages/WorkDetail')],
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

    // Preload как можно раньше (idle или через 150ms)
    scheduleIdleWork(() => {
      const preloads = routePreloads[currentPath];
      if (preloads) {
        preloads.forEach(load => {
          load().catch(() => {});
        });
      }
    }, 150);
  }, [location.pathname]);

  // Preload при наведении/тапе на ссылки продуктов
  useEffect(() => {
    const handleLinkHover = (e: MouseEvent | TouchEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('a[href^="/products/"]');
      if (!target) return;
      const href = target.getAttribute('href') || '';
      const slug = href.replace('/products/', '');
      if (slug) preloadProduct(slug);
    };

    document.addEventListener('mouseover', handleLinkHover, { passive: true });
    document.addEventListener('touchstart', handleLinkHover, { passive: true });
    return () => {
      document.removeEventListener('mouseover', handleLinkHover);
      document.removeEventListener('touchstart', handleLinkHover);
    };
  }, [preloadProduct]);
}
