import { useScroll, useTransform, Variants } from 'framer-motion';
import { useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

// Animation variants for scroll-triggered animations
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

export const cardReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.9,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.7, 
      ease: [0.16, 1, 0.3, 1],
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    }
  }
};

// Original scroll-based animation hook
export const useScrollAnimation = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [80, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.92, 1]);
  
  return { ref, opacity, y, scale, scrollYProgress };
};

// Extended hook with variants support
export const useAnimationVariants = () => {
  const shouldReduceMotion = usePrefersReducedMotion();
  
  const getVariants = (variant: Variants): Variants => {
    if (shouldReduceMotion) {
      return {
        hidden: { opacity: 1 },
        visible: { opacity: 1 }
      };
    }
    return variant;
  };
  
  return {
    shouldReduceMotion,
    getVariants,
    variants: {
      fadeInUp: getVariants(fadeInUp),
      fadeInDown: getVariants(fadeInDown),
      fadeInLeft: getVariants(fadeInLeft),
      fadeInRight: getVariants(fadeInRight),
      scaleIn: getVariants(scaleIn),
      cardReveal: getVariants(cardReveal),
      staggerContainer: shouldReduceMotion ? {} : staggerContainer,
      staggerContainerFast: shouldReduceMotion ? {} : staggerContainerFast,
    }
  };
};
