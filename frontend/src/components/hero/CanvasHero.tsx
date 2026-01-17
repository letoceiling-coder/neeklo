"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { HeroShowcase } from "@/components/hero/HeroShowcase";

export const CanvasHero = memo(function CanvasHero() {
  return (
    <section 
      id="hero" 
      className="relative w-full min-h-[100svh] flex flex-col overflow-hidden bg-background"
    >
      {/* Very subtle ambient gradient - works in light and dark */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute top-1/4 left-1/4 w-[400px] lg:w-[600px] h-[300px] lg:h-[500px] rounded-full bg-primary/[0.015] dark:bg-primary/[0.02] blur-[120px] lg:blur-[160px]" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="absolute bottom-1/3 right-1/4 w-[300px] lg:w-[500px] h-[250px] lg:h-[400px] rounded-full bg-cyan-500/[0.01] dark:bg-cyan-500/[0.015] blur-[100px] lg:blur-[140px]" 
        />
      </div>

      {/* Hero Content - with safe padding for mobile bottom nav */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex-1 flex flex-col justify-center pt-24 sm:pt-28 lg:pt-24 pb-[100px] sm:pb-32 lg:pb-20"
      >
        <HeroShowcase />
      </motion.div>
    </section>
  );
});
