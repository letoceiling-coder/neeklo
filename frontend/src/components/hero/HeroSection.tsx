import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { BriefWizard } from './BriefWizard';
import { useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function HeroSection() {
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const shouldReduceMotion = usePrefersReducedMotion();

  const handleCtaClick = () => {
    setIsBriefOpen(true);
  };

  const scrollToCases = () => {
    const casesSection = document.getElementById('cases');
    casesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  };

  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
        {/* Animated background */}
        <AnimatedBackground />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/95" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center justify-center min-h-screen">
          {/* Main content */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto">
            {/* Main headline */}
            <motion.h1
              initial={shouldReduceMotion ? {} : fadeInUp.initial}
              animate={shouldReduceMotion ? {} : fadeInUp.animate}
              transition={
                shouldReduceMotion
                  ? {}
                  : { ...fadeInUp.transition, delay: 0.3 }
              }
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
                         font-bold leading-tight mb-8"
            >
              <span className="bg-gradient-to-r from-white via-gray-100 to-white 
                             bg-clip-text text-transparent">
                Создание сайтов,{' '}
                <br className="hidden md:block" />
                Mini App и AI видео
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? {}
                  : { duration: 0.6, delay: 0.5 }
              }
              className="text-lg md:text-xl lg:text-2xl text-[#a3a3a3] mb-12 max-w-2xl"
            >
              Разрабатываем продукты, которые приносят деньги
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? {}
                  : { duration: 0.6, delay: 0.7 }
              }
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              {/* Primary CTA */}
              <button
                onClick={handleCtaClick}
                className="group relative px-8 py-4 rounded-xl font-semibold text-base
                           bg-gradient-to-r from-cyan-400 to-cyan-500 text-black
                           shadow-lg shadow-cyan-500/50 
                           hover:shadow-xl hover:shadow-cyan-500/60
                           hover:scale-105 active:scale-95
                           transition-all duration-200 overflow-hidden
                           focus-visible:outline-none focus-visible:ring-2 
                           focus-visible:ring-cyan-400 focus-visible:ring-offset-2 
                           focus-visible:ring-offset-black"
                aria-label="Узнать стоимость проекта"
              >
                <span
                  className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 
                             rounded-xl blur opacity-50 group-hover:opacity-75 
                             transition-opacity duration-300"
                />
                <span className="relative flex items-center justify-center gap-2">
                  Узнать стоимость
                  <ArrowRight
                    className="w-5 h-5 group-hover:translate-x-1 
                             transition-transform duration-200"
                  />
                </span>
              </button>

              {/* Secondary CTA */}
              <button
                onClick={scrollToCases}
                className="group px-8 py-4 rounded-xl font-semibold text-base
                           border-2 border-[#404040] text-white
                           hover:border-cyan-400 hover:bg-cyan-400/5
                           transition-all duration-300
                           focus-visible:outline-none focus-visible:ring-2 
                           focus-visible:ring-cyan-400 focus-visible:ring-offset-2 
                           focus-visible:ring-offset-black"
                aria-label="Смотреть кейсы"
              >
                <span
                  className="flex items-center justify-center gap-2 
                             group-hover:text-cyan-400 transition-colors"
                >
                  Смотреть кейсы
                  <ArrowRight
                    className="w-5 h-5 group-hover:translate-x-1 
                             transition-transform duration-200"
                  />
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brief Wizard Modal */}
      <BriefWizard isOpen={isBriefOpen} onClose={() => setIsBriefOpen(false)} />
    </>
  );
}
