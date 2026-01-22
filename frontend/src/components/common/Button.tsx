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
    
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium disabled:opacity-50 disabled:pointer-events-none min-h-[40px] button-interactive";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 hover:border-primary/50",
      ghost: "text-foreground hover:bg-secondary hover:text-primary",
      outline: "bg-transparent text-foreground border border-border hover:border-primary hover:text-primary",
    };

    const sizes = {
      sm: "h-9 px-3.5 text-sm",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-7 text-base",
    };

    const MotionButton = motion.button as any;

    return (
      <MotionButton
        ref={ref}
        whileHover={shouldReduceMotion ? {} : {}}
        whileTap={shouldReduceMotion ? {} : {}}
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
