import { useState, useEffect } from 'react';

const SECTION_IDS = ['hero', 'products', 'cases', 'services', 'process', 'contact'];

export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const sectionVisibility = new Map<string, number>();

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        sectionVisibility.set(sectionId, entry.intersectionRatio);
      });

      // Find the section with highest visibility
      let maxRatio = 0;
      let mostVisibleSection: string | null = null;

      sectionVisibility.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisibleSection = id;
        }
      });

      if (mostVisibleSection && maxRatio > 0.2) {
        setActiveSection(mostVisibleSection);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      rootMargin: '-10% 0px -60% 0px',
    });

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return activeSection;
};

// Map section IDs to nav items
export const sectionToNavMap: Record<string, string> = {
  'hero': '/',
  'products': '/products',
  'cases': '/cases',
  'services': '/services',
  'process': '/process',
  'contact': '/contact',
};
