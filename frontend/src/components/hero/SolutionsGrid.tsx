"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Globe, Video, Bot, Smartphone } from "lucide-react";
import { SolutionCard } from "./SolutionCard";

const SOLUTIONS = [
  {
    id: "website",
    icon: Globe,
    title: "Сайты",
    subtitle: "Лендинг, сайт, магазин",
    link: "/products/website",
  },
  {
    id: "video",
    icon: Video,
    title: "Видео",
    subtitle: "Reels, промо, AI-вставки",
    link: "/products/ai-video",
  },
  {
    id: "bot",
    icon: Bot,
    title: "Боты",
    subtitle: "Заявки, продажи, поддержка",
    link: "/products/telegram-bot",
  },
  {
    id: "miniapp",
    icon: Smartphone,
    title: "Mini App",
    subtitle: "Каталог, заказ, кабинет",
    link: "/products/mini-app",
  },
];

interface SolutionsGridProps {
  variant?: "mobile" | "desktop";
}

// Hero SolutionsGrid - navigates to specific product pages
export const SolutionsGrid = memo(function SolutionsGrid({ variant = "mobile" }: SolutionsGridProps) {
  const isMobile = variant === "mobile";
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={isMobile 
        ? "grid grid-cols-2 gap-3 w-full max-w-[340px]" 
        : "grid grid-cols-4 gap-4 xl:gap-5 w-full max-w-[800px]"
      }
    >
      {SOLUTIONS.map((solution, index) => (
        <SolutionCard
          key={solution.id}
          icon={solution.icon}
          title={solution.title}
          subtitle={solution.subtitle}
          to={solution.link}
          delay={isMobile ? 0.15 + index * 0.05 : 0.2 + index * 0.06}
          variant={variant}
        />
      ))}
    </motion.div>
  );
});
