"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { ArrowRight, Globe, Bot, Video, Smartphone, LucideIcon, Currency, Clock, MessageCircle } from "lucide-react";
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
          "rounded-xl",
          "p-6 md:p-8",
          "bg-background",
          "border border-border/50",
          "shadow-md",
          "card-hover",
          "min-h-[240px] md:min-h-[260px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        )}
      >
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-6">
          <div className={cn(
            "flex-shrink-0",
            "w-12 h-12 md:w-14 md:h-14",
            "rounded-xl",
            "bg-primary/10",
            "border border-primary/20",
            "flex items-center justify-center",
            "group-hover:bg-primary/15",
            "transition-colors duration-200"
          )}>
            <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" strokeWidth={1.5} />
          </div>
          <h3 className={cn(
            "text-xl md:text-2xl font-semibold text-foreground pt-1",
            "group-hover:text-primary transition-colors duration-200"
          )}>
            {solution.title}
          </h3>
        </div>

        {/* Price + Duration block with icons */}
        <div className="flex-1 flex flex-col justify-end space-y-4 mb-6">
          {/* Price with icon */}
          <div className="flex items-center gap-2.5">
            <Currency className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {solution.price}
            </span>
          </div>
          
          {/* Duration with icon */}
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-base md:text-lg text-muted-foreground">
              {solution.duration}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className={cn(
          "inline-flex items-center justify-center gap-2",
          "w-full py-3 px-5",
          "rounded-lg",
          "text-sm font-medium",
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90",
          "shadow-sm hover:shadow-md",
          "transition-all duration-200",
          "min-h-[40px]"
        )}>
          <MessageCircle className="w-4 h-4" />
          Обсудить
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
              "py-3 px-5 rounded-lg",
              "bg-foreground/[0.03] dark:bg-white/[0.035]",
              "border border-foreground/[0.08] dark:border-white/[0.08]",
              "text-sm font-medium text-foreground",
              "hover:bg-foreground/[0.06] dark:hover:bg-white/[0.06]",
              "transition-all duration-200",
              "min-h-[40px]"
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
