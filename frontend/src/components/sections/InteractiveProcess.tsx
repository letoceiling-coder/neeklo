"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform, animate } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, Palette, Code, Rocket, TrendingUp, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMobile } from "@/hooks/useMobile";

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Search;
  gradient: string;
}

const steps: ProcessStep[] = [
  {
    id: 1,
    title: "Диагностика и аудит",
    subtitle: "Этап 1",
    description: "Быстрая оценка задач, бизнес-логики, проблем и целей. Проводим комплексный анализ текущего состояния, выявляем точки роста и формируем стратегию решения.",
    icon: Search,
    gradient: "from-primary/20 via-primary/10 to-transparent",
  },
  {
    id: 2,
    title: "Стратегия и техническое задание",
    subtitle: "Этап 2",
    description: "Формируем чёткое ТЗ, архитектуру и структуру продукта. Определяем технологический стек, функциональные требования и план разработки с учётом бизнес-целей.",
    icon: CheckCircle2,
    gradient: "from-secondary/20 via-secondary/10 to-transparent",
  },
  {
    id: 3,
    title: "Дизайн и прототипирование",
    subtitle: "Этап 3",
    description: "UX-логика, UI-компоненты, фирменный стиль. Создаём интерактивные прототипы, разрабатываем дизайн-систему и продумываем каждый пользовательский сценарий.",
    icon: Palette,
    gradient: "from-accent/20 via-accent/10 to-transparent",
  },
  {
    id: 4,
    title: "Разработка и интеграции",
    subtitle: "Этап 4",
    description: "Frontend, Backend, AI-интеграции, автоматизации. Реализуем продукт на современных технологиях, подключаем платёжные системы, CRM, аналитику и внешние API.",
    icon: Code,
    gradient: "from-primary/20 via-primary/10 to-transparent",
  },
  {
    id: 5,
    title: "Тестирование и запуск",
    subtitle: "Этап 5",
    description: "Проверяем стабильность, UX, проводим тесты на реальных сценариях. Устраняем баги, оптимизируем производительность и запускаем проект в продакшен.",
    icon: Rocket,
    gradient: "from-success/20 via-success/10 to-transparent",
  },
  {
    id: 6,
    title: "Поддержка и масштабирование",
    subtitle: "Этап 6",
    description: "Обеспечиваем системную поддержку, дорабатываем новые модули, подключаем AI-агентов для автоматизации, запускаем маркетинг и масштабируем результат.",
    icon: TrendingUp,
    gradient: "from-secondary/20 via-secondary/10 to-transparent",
  },
];

export const InteractiveProcess = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useMobile();
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  // Handle swipe navigation on mobile
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > 50 || Math.abs(velocity) > 500) {
      if (offset > 0 && activeStep > 0) {
        // Swipe right - previous step
        setActiveStep(activeStep - 1);
      } else if (offset < 0 && activeStep < steps.length - 1) {
        // Swipe left - next step
        setActiveStep(activeStep + 1);
      }
    }
    
    // Reset position
    animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    setIsDragging(false);
  };

  const goToStep = (step: number) => {
    setActiveStep(step);
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current || isMobile) return;

    const section = sectionRef.current;
    const totalSteps = steps.length;

    const ctx = gsap.context(() => {
      // Pin the section and animate through steps (desktop only)
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalSteps * 100}%`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const newStep = Math.min(
            Math.floor(progress * totalSteps),
            totalSteps - 1
          );
          setActiveStep(newStep);
        },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion, isMobile]);

  const currentStep = steps[activeStep];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-background via-background-secondary to-background overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <Container className="relative h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 w-full items-center">
          {/* Mobile Navigation Buttons */}
          {isMobile && (
            <>
              <button
                onClick={prevStep}
                disabled={activeStep === 0}
                className="lg:hidden fixed left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-effect flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-6 h-6 text-primary" />
              </button>
              <button
                onClick={nextStep}
                disabled={activeStep === steps.length - 1}
                className="lg:hidden fixed right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-effect flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                aria-label="Next step"
              >
                <ChevronRight className="w-6 h-6 text-primary" />
              </button>
            </>
          )}

          {/* Left Content */}
          <motion.div
            className="lg:col-span-5 space-y-6"
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            style={{ x: isMobile ? x : 0 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect"
                >
                  <currentStep.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground-muted">
                    {currentStep.subtitle}
                  </span>
                </motion.div>

                {/* Title */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
                  <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {currentStep.title}
                  </span>
                </h2>

                {/* Description */}
                <p className="text-lg md:text-xl text-foreground-muted leading-relaxed max-w-xl">
                  {currentStep.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Center Timeline - Hidden on mobile */}
          <div className="hidden lg:flex lg:col-span-2 justify-center">
            <div className="relative h-[500px]">
              {/* Background Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
              
              {/* Progress Line with Glow */}
              <motion.div
                className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-primary via-accent to-primary -translate-x-1/2 shadow-glow-primary"
                initial={{ height: 0 }}
                animate={{
                  height: `${((activeStep + 1) / steps.length) * 100}%`,
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Step Markers */}
              <div className="relative h-full flex flex-col justify-between py-8">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="relative flex items-center justify-center"
                  >
                    <motion.div
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                        index <= activeStep
                          ? "bg-primary border-primary shadow-glow-primary"
                          : "bg-surface border-border"
                      }`}
                      animate={{
                        scale: index === activeStep ? 1.5 : index <= activeStep ? 1.25 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.15,
                }}
                className="relative"
              >
                <div className="relative aspect-square max-w-md mx-auto">
                  {/* Glass Card */}
                  <div className="absolute inset-0 glass-effect rounded-3xl overflow-hidden">
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${currentStep.gradient} opacity-60`}
                    />

                    {/* Content */}
                    <div className="relative h-full flex flex-col items-center justify-center p-12 space-y-6">
                      {/* Large Step Number */}
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-9xl font-bold text-primary/20 leading-none"
                      >
                        {currentStep.id}
                      </motion.div>

                      {/* Icon */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="relative"
                      >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-xl flex items-center justify-center border border-border shadow-lg">
                          <currentStep.icon className="w-12 h-12 text-primary" />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                      </motion.div>
                    </div>

                    {/* Floating particles */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full blur-sm" style={{ animation: "float 3s ease-in-out infinite" }} />
                    <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-accent/30 rounded-full blur-sm" style={{ animation: "float 3s ease-in-out infinite 1s" }} />
                    <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-secondary/30 rounded-full blur-sm" style={{ animation: "float 3s ease-in-out infinite 2s" }} />
                  </div>

                  {/* Glow effect behind card */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl -z-10 opacity-50" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Progress Indicator - Interactive */}
        <div className="lg:hidden absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => goToStep(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80 ${
                index === activeStep
                  ? "w-12 bg-primary shadow-glow-primary"
                  : index < activeStep
                  ? "w-8 bg-primary/50"
                  : "w-6 bg-border"
              }`}
              aria-label={`Go to step ${index + 1}: ${step.title}`}
            />
          ))}
        </div>

        {/* Swipe Hint - Show on first load */}
        {isMobile && activeStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="lg:hidden absolute bottom-20 left-1/2 -translate-x-1/2 text-xs text-foreground-muted flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4 animate-pulse" />
            <span>Свайпните для навигации</span>
            <ChevronRight className="w-4 h-4 animate-pulse" />
          </motion.div>
        )}

        {/* Scroll Hint */}
        {activeStep === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-8 hidden lg:flex items-center gap-2 text-sm text-foreground-muted"
          >
            <span>Прокрутите вниз</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-primary"
            >
              ↓
            </motion.div>
          </motion.div>
        )}
      </Container>
    </section>
  );
};
