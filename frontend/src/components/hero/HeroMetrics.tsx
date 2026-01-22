"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export const HeroMetrics = () => {
  const shouldReduceMotion = usePrefersReducedMotion();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : fadeInUp.initial}
      animate={
        shouldReduceMotion
          ? {}
          : {
              ...fadeInUp.animate,
              y: [0, -8, 0],
            }
      }
      transition={
        shouldReduceMotion
          ? {}
          : {
              ...fadeInUp.transition,
              delay: 0.8,
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }
      }
      className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base text-[#737373] font-medium"
    >
      <span className="flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"
          aria-hidden="true"
        />
        150+ проектов
      </span>
      <span aria-hidden="true">·</span>
      <span>4-14 дней</span>
      <span aria-hidden="true">·</span>
      <span>от 45 000 ₽</span>
    </motion.div>
  );
};
