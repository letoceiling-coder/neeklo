import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, asChild, ...props }, ref) => {
    const shouldReduceMotion = usePrefersReducedMotion();
    
    const baseStyles = "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(122,162,255,0.4)] active:scale-95",
      secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 hover:border-primary/50 active:scale-95",
      ghost: "text-foreground hover:bg-secondary hover:text-primary active:scale-95",
      outline: "bg-transparent text-foreground border border-border hover:border-primary hover:text-primary active:scale-95",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
    };

    const MotionButton = motion.button as any;

    return (
      <MotionButton
        ref={ref}
        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </MotionButton>
    );
  }
);

Button.displayName = "Button";

export { Button };
