"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { ArrowRight, Globe, Bot, Video, Smartphone, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/useMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Solution {
  id: string;
  title: string;
  price: string;
  duration: string;
  href: string;
  icon: LucideIcon;
}

const SOLUTIONS: Solution[] = [
  {
    id: "website",
    title: "Сайт для бизнеса",
    price: "от 120 000 ₽",
    duration: "7–10 дней",
    href: "/products/website",
    icon: Globe,
  },
  {
    id: "bot",
    title: "Telegram-бот",
    price: "от 90 000 ₽",
    duration: "5–7 дней",
    href: "/products/telegram-bot",
    icon: Bot,
  },
  {
    id: "video",
    title: "Видео для продаж",
    price: "от 60 000 ₽",
    duration: "3–5 дней",
    href: "/products/ai-video",
    icon: Video,
  },
  {
    id: "miniapp",
    title: "Mini App",
    price: "от 150 000 ₽",
    duration: "10–14 дней",
    href: "/products/mini-app",
    icon: Smartphone,
  },
];

// Solution Card Component - entire card is clickable
const SolutionCard = memo(function SolutionCard({
  solution,
  index,
  isMobile,
  shouldReduceMotion,
}: {
  solution: Solution;
  index: number;
  isMobile: boolean;
  shouldReduceMotion: boolean;
}) {
  const Icon = solution.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.4,
        delay: index * 0.08,
      }}
      className="h-full"
    >
      <Link
        to={solution.href}
        className={cn(
          "group flex flex-col h-full cursor-pointer",
          "rounded-[20px] lg:rounded-[28px]",
          "p-5 md:p-6",
          // Glass UI style
          "bg-foreground/[0.02] dark:bg-white/[0.035]",
          "backdrop-blur-xl",
          "border border-foreground/[0.06] dark:border-white/[0.06]",
          // Hover effects
          "transition-all duration-300",
          "hover:bg-foreground/[0.04] dark:hover:bg-white/[0.05]",
          "hover:border-foreground/[0.12] dark:hover:border-white/[0.12]",
          !isMobile && "hover:-translate-y-1",
          "active:scale-[0.98]",
          "min-h-[180px] md:min-h-[200px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        )}
      >
        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-4">
          <div className={cn(
            "flex-shrink-0",
            "w-10 h-10 md:w-11 md:h-11",
            "rounded-xl",
            "bg-primary/10 dark:bg-primary/15",
            "border border-primary/20",
            "flex items-center justify-center",
            "group-hover:bg-primary/15 dark:group-hover:bg-primary/20",
            "transition-colors duration-200"
          )}>
            <Icon className="w-5 h-5 md:w-5.5 md:h-5.5 text-primary" strokeWidth={1.5} />
          </div>
          <h3 className={cn(
            "text-lg md:text-xl font-medium text-foreground pt-1.5",
            "group-hover:text-primary transition-colors duration-200"
          )}>
            {solution.title}
          </h3>
        </div>

        {/* Price + Duration block */}
        <div className="flex-1 flex flex-col justify-end">
          <div className="mb-4 space-y-1">
            {/* Price */}
            <div className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              {solution.price}
            </div>
            {/* Duration */}
            <div className="text-sm text-muted-foreground/80">
              {solution.duration}
            </div>
          </div>

          {/* Visual CTA indicator */}
          <div className={cn(
            "inline-flex items-center justify-center gap-2",
            "w-full py-3 px-4",
            "rounded-xl",
            "text-sm font-medium",
            "bg-foreground/[0.04] dark:bg-white/[0.06]",
            "border border-foreground/[0.08] dark:border-white/[0.08]",
            "text-muted-foreground",
            "group-hover:bg-primary/10 group-hover:border-primary/20",
            "group-hover:text-foreground",
            "transition-all duration-200"
          )}>
            Подробнее
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export function ReadySolutions() {
  const isMobile = useMobile();
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <section id="products" className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10"
        >
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Готовые решения
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-md">
              Цена и сроки — сразу. Без скрытых платежей.
            </p>
          </div>

          {/* Desktop: All products link */}
          <Link
            to="/products"
            className={cn(
              "hidden md:inline-flex items-center gap-1.5",
              "text-sm font-medium",
              "text-muted-foreground hover:text-foreground",
              "transition-colors duration-200"
            )}
          >
            Все продукты
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {SOLUTIONS.map((solution, index) => (
            <SolutionCard
              key={solution.id}
              solution={solution}
              index={index}
              isMobile={isMobile}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>

        {/* Mobile: All products link */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.3 }}
          className="mt-8 md:hidden"
        >
          <Link
            to="/products"
            className={cn(
              "flex items-center justify-center gap-2 w-full",
              "py-4 px-6 rounded-2xl",
              "bg-foreground/[0.03] dark:bg-white/[0.035]",
              "border border-foreground/[0.08] dark:border-white/[0.08]",
              "text-sm font-medium text-foreground",
              "hover:bg-foreground/[0.06] dark:hover:bg-white/[0.06]",
              "transition-all duration-200"
            )}
          >
            Все продукты
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
