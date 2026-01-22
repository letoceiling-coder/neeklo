import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, glass = false, children, ...props }, ref) => {
    const baseStyles = "rounded-2xl border border-border bg-card p-8";
    const hoverStyles = hover ? "card-hover" : "";
    const glassStyles = glass ? "glass-effect" : "";

    const MotionDiv = motion.div as any;

    return (
      <MotionDiv
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cn(baseStyles, hoverStyles, glassStyles, className)}
        {...props}
      >
        {children}
      </MotionDiv>
    );
  }
);

Card.displayName = "Card";

export { Card };
