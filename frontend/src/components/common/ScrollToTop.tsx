import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component - автоматически прокручивает страницу наверх при изменении маршрута
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Прокрутка наверх при изменении пути
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // instant для мгновенной прокрутки
    });
  }, [pathname]);

  return null;
}
