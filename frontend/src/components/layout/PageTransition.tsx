import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const shouldReduceMotion = usePrefersReducedMotion();
  const [isFirstMount, setIsFirstMount] = useState(true);

  // Skip animation on first mount to prevent initial flash
  useEffect(() => {
    const timer = setTimeout(() => setIsFirstMount(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const pageVariants = {
    initial: {
      opacity: isFirstMount ? 1 : 0,
      y: shouldReduceMotion || isFirstMount ? 0 : 12,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -8,
    },
  };

  const pageTransition = {
    duration: shouldReduceMotion || isFirstMount ? 0 : 0.25,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        style={{ willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
