import { useEffect } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Scroll-triggered animations using Intersection Observer API
 * 
 * Effects:
 * 1. Fade-in on scroll for elements with class `.scroll-fade`
 * 2. Staggered fade-in for groups with class `.scroll-stagger > *` (50ms delay per item)
 * 3. Count-up animation for numbers with class `.scroll-count` (data-target holds final value)
 * 
 * All animations trigger once per element and are performant.
 */
export function useScrollAnimations() {
  const shouldReduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Skip animations if user prefers reduced motion
    if (shouldReduceMotion) {
      // Still add visible state but without animations
      const allElements = document.querySelectorAll('.scroll-fade, .scroll-stagger, .scroll-count');
      allElements.forEach(el => {
        el.classList.add('animate-fade-in');
      });
      return;
    }

    const fadeElements = document.querySelectorAll('.scroll-fade');
    const staggerGroups = document.querySelectorAll('.scroll-stagger');
    const counters = document.querySelectorAll('.scroll-count');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target;

          // Fade in
          if (target.classList.contains('scroll-fade')) {
            target.classList.add('animate-fade-in');
            observer.unobserve(target);
            return;
          }

          // Stagger
          if (target.classList.contains('scroll-stagger')) {
            const children = Array.from(target.children);
            children.forEach((child, i) => {
              setTimeout(() => {
                child.classList.add('animate-fade-in');
              }, i * 50);
            });
            observer.unobserve(target);
            return;
          }

          // Count-up
          if (target.classList.contains('scroll-count')) {
            const el = target as HTMLElement;
            const targetValue = parseInt(el.dataset.target || '0', 10);
            const duration = parseInt(el.dataset.duration || '1200', 10);
            const startValue = parseInt(el.dataset.start || '0', 10);
            
            if (targetValue <= 0) {
              observer.unobserve(target);
              return;
            }

            let current = startValue;
            const steps = 40;
            const increment = (targetValue - startValue) / steps;
            const stepDuration = duration / steps;

            const interval = setInterval(() => {
              current += increment;
              if (current >= targetValue) {
                current = targetValue;
                clearInterval(interval);
                observer.unobserve(target);
              }
              
              // Format number (handle decimals, add suffixes, etc.)
              const format = el.dataset.format || 'number';
              if (format === 'number') {
                el.textContent = Math.floor(current).toString();
              } else if (format === 'currency') {
                el.textContent = new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  maximumFractionDigits: 0,
                }).format(Math.floor(current));
              } else if (format === 'percent') {
                el.textContent = `${Math.floor(current)}%`;
              } else if (format === 'decimal') {
                el.textContent = current.toFixed(1);
              } else {
                el.textContent = Math.floor(current).toString();
              }
            }, stepDuration);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element enters viewport
      }
    );

    // Observe all elements
    fadeElements.forEach((el) => observer.observe(el));
    staggerGroups.forEach((group) => observer.observe(group));
    counters.forEach((counter) => observer.observe(counter));

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [shouldReduceMotion]);
}
