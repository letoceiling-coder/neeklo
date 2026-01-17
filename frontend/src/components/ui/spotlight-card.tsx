import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import React, { MouseEvent, ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  glowColor?: "blue" | "purple" | "green" | "orange";
  className?: string;
  width?: string;
  height?: number;
}

const glowColors = {
  blue: "rgba(59, 130, 246, 0.5)",
  purple: "rgba(168, 85, 247, 0.5)",
  green: "rgba(34, 197, 94, 0.5)",
  orange: "rgba(249, 115, 22, 0.5)",
};

export const GlowCard = ({
  children,
  glowColor = "blue",
  className,
  width = "100%",
  height = 380,
}: GlowCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const glowBackground = useMotionTemplate`
    radial-gradient(
      350px circle at ${mouseX}px ${mouseY}px,
      ${glowColors[glowColor]},
      transparent 80%
    )
  `;

  return (
    <motion.div
      className={cn(
        "group relative rounded-xl overflow-hidden bg-card border border-border/50 transition-all duration-300",
        "hover:border-border hover:shadow-lg",
        className
      )}
      style={{ width, minHeight: height }}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Glow effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: glowBackground,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};
