import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface ParallaxOptions {
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  offset?: [string, string];
}

export function useParallax(options: ParallaxOptions = {}) {
  const { speed = 0.5, direction = "up", offset = ["start end", "end start"] } = options;
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  // Calculate transform based on direction
  const range = [-100 * speed, 100 * speed];
  
  let y: MotionValue<number> | number = 0;
  let x: MotionValue<number> | number = 0;

  if (!prefersReducedMotion) {
    switch (direction) {
      case "up":
        y = useTransform(scrollYProgress, [0, 1], range);
        break;
      case "down":
        y = useTransform(scrollYProgress, [0, 1], range.reverse());
        break;
      case "left":
        x = useTransform(scrollYProgress, [0, 1], range);
        break;
      case "right":
        x = useTransform(scrollYProgress, [0, 1], range.reverse());
        break;
    }
  }

  return { ref, y, x, scrollYProgress };
}

export function useParallaxScale(options: { scaleRange?: [number, number] } = {}) {
  const { scaleRange = [1, 1.1] } = options;
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = prefersReducedMotion 
    ? 1 
    : useTransform(scrollYProgress, [0, 0.5, 1], [scaleRange[0], scaleRange[1], scaleRange[0]]);

  const opacity = prefersReducedMotion
    ? 1
    : useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return { ref, scale, opacity, scrollYProgress };
}

export function useParallaxRotate(options: { rotateRange?: [number, number] } = {}) {
  const { rotateRange = [-5, 5] } = options;
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotate = prefersReducedMotion 
    ? 0 
    : useTransform(scrollYProgress, [0, 1], rotateRange);

  return { ref, rotate, scrollYProgress };
}
