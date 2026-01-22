import { Suspense, lazy, useState, useEffect, useRef } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export function SplineBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Определить мобильное устройство
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Не нужно для мобильных

    const removeWatermark = () => {
      if (!containerRef.current) return;

      // Найти все подозрительные элементы внутри контейнера
      const container = containerRef.current;
      
      // Удалить все fixed элементы внутри контейнера
      const fixedElements = container.querySelectorAll('[style*="position: fixed"]');
      fixedElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.style.position === 'fixed' && 
            (htmlEl.style.bottom || htmlEl.style.right)) {
          htmlEl.style.display = 'none';
          htmlEl.style.visibility = 'hidden';
          htmlEl.style.opacity = '0';
        }
      });

      // Удалить все ссылки на spline
      const links = container.querySelectorAll('a[href*="spline"]');
      links.forEach((link) => {
        const htmlLink = link as HTMLElement;
        htmlLink.style.display = 'none';
        htmlLink.style.visibility = 'hidden';
        htmlLink.style.opacity = '0';
      });

      // Удалить элементы по ID/классу
      const watermarks = document.querySelectorAll(
        '#spline-watermark, [id*="watermark"], [class*="watermark"]'
      );
      watermarks.forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.textContent?.toLowerCase().includes('spline') || 
            htmlEl.innerHTML?.toLowerCase().includes('spline')) {
          htmlEl.style.display = 'none';
          htmlEl.style.visibility = 'hidden';
          htmlEl.style.opacity = '0';
        }
      });

      // Удалить все fixed элементы в body, которые могут быть watermark
      const bodyFixedElements = document.querySelectorAll('body > [style*="position: fixed"]');
      bodyFixedElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const style = htmlEl.style;
        if (style.position === 'fixed' && 
            (style.bottom || style.right) && 
            (htmlEl.textContent?.toLowerCase().includes('spline') ||
             htmlEl.innerHTML?.toLowerCase().includes('spline'))) {
          htmlEl.style.display = 'none';
          htmlEl.style.visibility = 'hidden';
          htmlEl.style.opacity = '0';
        }
      });
    };

    // Запускать периодически
    const interval = setInterval(removeWatermark, 100);
    
    // Первый запуск с задержками
    const timeouts = [100, 300, 500, 1000, 2000, 3000].map((delay) =>
      setTimeout(removeWatermark, delay)
    );

    // Наблюдать за DOM изменениями
    const observer = new MutationObserver(removeWatermark);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
      observer.disconnect();
    };
  }, [isMobile]);

  // На мобильных показать статичный фон вместо 3D
  if (isMobile) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.15), transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(34, 211, 238, 0.15), transparent 50%),
              #0a0a0a
            `
          }}
        />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden"
      style={{ position: 'absolute' }}
    >
      <Suspense fallback={
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent 
                          rounded-full animate-spin" />
          </div>
        </div>
      }>
        <Spline
          className="w-full h-full"
          scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
        />
      </Suspense>
      
      {/* Градиент оверлей для читаемости текста */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.8)),
            linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.9))
          `
        }}
      />
      
      {/* Дополнительное затемнение для скрытия watermark */}
      <div className="absolute bottom-0 right-0 w-64 h-24 
                      bg-gradient-to-tl from-black via-black/80 to-transparent 
                      pointer-events-none z-10" />
    </div>
  );
}
