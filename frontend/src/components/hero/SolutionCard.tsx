"use client";

import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SolutionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  to: string;
  delay?: number;
  variant?: "mobile" | "desktop";
}

// Navigable card in Hero - links directly to product page
export const SolutionCard = memo(function SolutionCard({
  icon: Icon,
  title,
  subtitle,
  to,
  delay = 0,
  variant = "mobile",
}: SolutionCardProps) {
  const isMobile = variant === "mobile";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
    >
      <Link 
        to={to}
        className={cn(
          "group block h-full cursor-pointer",
          "rounded-[20px] lg:rounded-[24px]",
          "bg-foreground/[0.03] dark:bg-white/[0.035]",
          "border border-foreground/[0.06] dark:border-white/[0.06]",
          "hover:bg-foreground/[0.06] dark:hover:bg-white/[0.06]",
          "hover:border-foreground/[0.12] dark:hover:border-white/[0.12]",
          "card-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <motion.div
          whileHover={!isMobile ? {} : undefined}
          whileTap={{}}
          className={cn(
            "flex flex-col h-full",
            isMobile ? "p-5 min-h-[130px]" : "p-5 xl:p-6 min-h-[160px]"
          )}
        >
          {/* Icon */}
          <div className={cn(
            "rounded-xl lg:rounded-2xl",
            "bg-primary/10 dark:bg-primary/15",
            "border border-primary/15 dark:border-primary/20",
            "flex items-center justify-center",
            "group-hover:bg-primary/15 dark:group-hover:bg-primary/20",
            "group-hover:border-primary/25",
            "transition-all duration-200",
            "mb-3",
            isMobile ? "w-12 h-12" : "w-12 h-12 xl:w-14 xl:h-14"
          )}>
            <Icon className={cn(
              "text-primary",
              isMobile ? "w-6 h-6" : "w-6 h-6 xl:w-7 xl:h-7"
            )} strokeWidth={1.5} />
          </div>

          {/* Text */}
          <div className="flex-1 flex flex-col justify-end">
            <h3 className={cn(
              "font-semibold text-foreground",
              "group-hover:text-primary transition-colors duration-200",
              isMobile ? "text-[15px] mb-0.5" : "text-base xl:text-lg mb-1"
            )}>
              {title}
            </h3>
            <p className={cn(
              "text-muted-foreground/70",
              "leading-snug",
              isMobile ? "text-[12px]" : "text-xs xl:text-sm"
            )}>
              {subtitle}
            </p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
});
