import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    let trailId = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create trail effect
      setTrail((prev) => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: trailId++ }];
        return newTrail.slice(-5); // Keep only last 5 points
      });

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") !== null ||
        target.closest("a") !== null;
      
      setIsHovering(isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Hide on mobile/touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Trail effect */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed pointer-events-none z-[100]"
          style={{
            left: point.x,
            top: point.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="w-8 h-8 rounded-full"
            style={{
              background: `radial-gradient(circle, hsl(var(--primary) / ${0.3 - index * 0.05}), transparent)`,
              opacity: 1 - index * 0.15,
            }}
          />
        </motion.div>
      ))}

      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[100]"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <div
          className="w-10 h-10 rounded-full transition-all duration-300"
          style={{
            background: isHovering
              ? "radial-gradient(circle, hsl(var(--primary) / 0.6), hsl(var(--accent) / 0.3))"
              : "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent)",
            boxShadow: isHovering
              ? "0 0 40px hsl(var(--primary) / 0.5)"
              : "0 0 20px hsl(var(--primary) / 0.3)",
          }}
        />
      </motion.div>
    </>
  );
};
