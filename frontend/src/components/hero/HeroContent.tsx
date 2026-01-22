"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { BriefWizard } from "./BriefWizard";
import { useState } from "react";

interface HeroContentProps {
  onOpenBrief?: () => void;
}

export const HeroContent = ({ onOpenBrief }: HeroContentProps) => {
  const shouldReduceMotion = usePrefersReducedMotion();
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  };

  const handlePrimaryClick = () => {
    setIsBriefOpen(true);
    onOpenBrief?.();
  };

  const handleSecondaryClick = () => {
    const casesSection = document.getElementById("cases");
    if (casesSection) {
      casesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <motion.h1
          initial={shouldReduceMotion ? {} : fadeInUp.initial}
          animate={shouldReduceMotion ? {} : fadeInUp.animate}
          transition={
            shouldReduceMotion
              ? {}
              : { ...fadeInUp.transition, delay: 0.2 }
          }
          className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight text-white drop-shadow-lg"
        >
          Создание сайтов, Mini App и&nbsp;AI&nbsp;видео
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={shouldReduceMotion ? {} : fadeInUp.initial}
          animate={shouldReduceMotion ? {} : fadeInUp.animate}
          transition={
            shouldReduceMotion
              ? {}
              : { ...fadeInUp.transition, delay: 0.4 }
          }
          className="text-lg md:text-xl text-[#a3a3a3] mb-12 max-w-2xl mx-auto font-normal"
        >
          Разрабатываем продукты, которые приносят деньги
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={shouldReduceMotion ? {} : fadeInUp.initial}
          animate={shouldReduceMotion ? {} : fadeInUp.animate}
          transition={
            shouldReduceMotion
              ? {}
              : { ...fadeInUp.transition, delay: 0.6 }
          }
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          {/* Primary CTA */}
          <motion.button
            onClick={handlePrimaryClick}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-xl font-semibold text-base text-black shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-200 ease-out flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Узнать стоимость проекта"
          >
            {/* Pulsing glow effect */}
            <span
              className="absolute -inset-0.5 bg-cyan-400 rounded-xl blur-lg opacity-30 group-hover:opacity-50 animate-pulse transition-opacity"
              aria-hidden="true"
            />
            <span className="relative">Узнать стоимость</span>
            <ArrowUpRight
              className="w-5 h-5 relative group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
            />
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            onClick={handleSecondaryClick}
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="group px-8 py-4 border-2 border-[#404040] rounded-xl font-semibold text-base text-white hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all duration-200 ease-out flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Смотреть кейсы"
          >
            Смотреть кейсы
            <ArrowRight
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Brief Wizard */}
      <BriefWizard
        isOpen={isBriefOpen}
        onClose={() => setIsBriefOpen(false)}
      />
    </>
  );
};
