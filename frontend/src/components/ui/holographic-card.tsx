import React, { useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export const HolographicCard = ({ 
  children, 
  className,
  glowColor = '#6366f1'
}: HolographicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
    card.style.setProperty('--bg-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--bg-y', `${(y / rect.height) * 100}%`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.setProperty('--x', `50%`);
    card.style.setProperty('--y', `50%`);
    card.style.setProperty('--bg-x', '50%');
    card.style.setProperty('--bg-y', '50%');
  };

  return (
    <div 
      className={cn(
        "holographic-card relative rounded-2xl overflow-hidden cursor-pointer",
        "transition-all duration-300 ease-out will-change-transform",
        "bg-card/50 backdrop-blur-sm border border-border/50",
        "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]",
        "hover:shadow-[0_30px_80px_-20px_rgba(99,102,241,0.4)]",
        className
      )}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--glow-color': glowColor,
        '--x': '50%',
        '--y': '50%',
        '--bg-x': '50%',
        '--bg-y': '50%',
      } as React.CSSProperties}
    >
      {/* Holographic gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              600px circle at var(--bg-x) var(--bg-y),
              rgba(99, 102, 241, 0.15),
              rgba(139, 92, 246, 0.1),
              transparent 40%
            )
          `
        }}
      />
      
      {/* Light reflection effect */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              400px circle at var(--x) var(--y),
              rgba(255, 255, 255, 0.1),
              transparent 60%
            )
          `
        }}
      />

      {/* Glow effect */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"
        style={{
          background: `
            radial-gradient(
              circle at var(--x) var(--y),
              var(--glow-color),
              transparent 50%
            )
          `
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
