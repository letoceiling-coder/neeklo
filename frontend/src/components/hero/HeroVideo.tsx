"use client";

interface HeroVideoProps {
  className?: string;
}

export const HeroVideo = ({ className = "" }: HeroVideoProps) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        background: `linear-gradient(
          135deg,
          hsl(200, 30%, 15%) 0%,
          hsl(220, 40%, 12%) 50%,
          hsl(240, 50%, 8%) 100%
        )`,
      }}
      aria-hidden="true"
    >
      {/* Gradient background with subtle color - можно заменить на изображение позже */}
    </div>
  );
};
