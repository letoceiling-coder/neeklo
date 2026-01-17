import { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "dots" | "gradient" | "glow" | "grid" | "orbs";
  intensity?: "subtle" | "medium" | "strong";
}

export const ParallaxBackground = memo(function ParallaxBackground({
  children,
  className = "",
  variant = "gradient",
  intensity = "medium",
}: ParallaxBackgroundProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();

  const speeds = {
    subtle: { y: 30, scale: 0.02, rotate: 2 },
    medium: { y: 50, scale: 0.05, rotate: 5 },
    strong: { y: 80, scale: 0.08, rotate: 10 },
  };

  const { y: ySpeed, scale: scaleSpeed, rotate: rotateSpeed } = speeds[intensity];

  const y1 = useTransform(scrollYProgress, [0, 1], [0, ySpeed]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -ySpeed * 0.7]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, ySpeed * 1.2]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1 + scaleSpeed, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, rotateSpeed]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background layers based on variant */}
      {variant === "gradient" && (
        <>
          <motion.div
            style={{ y: y1, scale }}
            className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] opacity-30 pointer-events-none"
          >
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          </motion.div>
          <motion.div
            style={{ y: y2 }}
            className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] opacity-20 pointer-events-none"
          >
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/30 rounded-full blur-[100px]" />
          </motion.div>
        </>
      )}

      {variant === "orbs" && (
        <>
          <motion.div
            style={{ y: y1, x: y2, rotate }}
            className="absolute top-20 left-[10%] w-64 h-64 opacity-20 pointer-events-none"
          >
            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-[80px]" />
          </motion.div>
          <motion.div
            style={{ y: y2, x: y1 }}
            className="absolute top-1/2 right-[5%] w-48 h-48 opacity-25 pointer-events-none"
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 rounded-full blur-[60px]" />
          </motion.div>
          <motion.div
            style={{ y: y3, rotate }}
            className="absolute bottom-20 left-1/3 w-72 h-72 opacity-15 pointer-events-none"
          >
            <div className="w-full h-full bg-gradient-to-br from-primary to-accent rounded-full blur-[100px]" />
          </motion.div>
        </>
      )}

      {variant === "glow" && (
        <motion.div
          style={{ y: y1, scale }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        </motion.div>
      )}

      {variant === "grid" && (
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
        >
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </motion.div>
      )}

      {variant === "dots" && (
        <motion.div
          style={{ y: y2 }}
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
        >
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
});

// Floating orb component for hero sections
export const FloatingOrb = memo(function FloatingOrb({
  size = 200,
  color = "primary",
  position = { top: "10%", left: "10%" },
  blur = 80,
  speed = 0.5,
}: {
  size?: number;
  color?: "primary" | "accent" | "cyan" | "purple" | "pink";
  position?: { top?: string; left?: string; right?: string; bottom?: string };
  blur?: number;
  speed?: number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);
  const x = useTransform(scrollYProgress, [0, 1], [0, 50 * speed]);

  const colors = {
    primary: "from-primary/30 to-primary/10",
    accent: "from-accent/30 to-accent/10",
    cyan: "from-cyan-500/30 to-cyan-500/10",
    purple: "from-purple-500/30 to-purple-500/10",
    pink: "from-pink-500/30 to-pink-500/10",
  };

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      style={{ y, x, ...position }}
      className="absolute pointer-events-none"
    >
      <div
        className={`bg-gradient-to-br ${colors[color]} rounded-full`}
        style={{
          width: size,
          height: size,
          filter: `blur(${blur}px)`,
        }}
      />
    </motion.div>
  );
});
