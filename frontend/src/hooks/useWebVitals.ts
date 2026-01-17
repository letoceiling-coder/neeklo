import { useEffect } from 'react';

// Web Vitals reporting for production monitoring
export function useWebVitals() {
  useEffect(() => {
    // Only measure in production
    if (import.meta.env.DEV) return;

    const reportWebVital = (metric: { name: string; value: number; id: string }) => {
      // Send to analytics (console for now, replace with your analytics)
      console.log(`[Web Vital] ${metric.name}: ${metric.value.toFixed(2)}ms`);
    };

    // Measure LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      if (lastEntry) {
        reportWebVital({
          name: 'LCP',
          value: lastEntry.startTime,
          id: 'lcp',
        });
      }
    });

    // Measure FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEntry & { processingStart: number; startTime: number };
        reportWebVital({
          name: 'FID',
          value: fidEntry.processingStart - fidEntry.startTime,
          id: 'fid',
        });
      });
    });

    // Measure CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const clsEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value;
        }
      });
    });

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      fidObserver.observe({ type: 'first-input', buffered: true });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // Browser doesn't support these observers
    }

    // Report CLS on page hide
    const reportCLS = () => {
      reportWebVital({ name: 'CLS', value: clsValue * 1000, id: 'cls' });
    };

    window.addEventListener('pagehide', reportCLS);

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      window.removeEventListener('pagehide', reportCLS);
    };
  }, []);
}
