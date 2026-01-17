import { memo } from 'react';

interface PageSkeletonProps {
  variant?: 'default' | 'product' | 'minimal';
}

export const PageSkeleton = memo(function PageSkeleton({ variant = 'default' }: PageSkeletonProps) {
  // Faster shimmer animation with opacity instead of background
  const shimmerClass = "bg-muted/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-muted/30 before:to-transparent before:animate-[shimmer_1s_ease-in-out_infinite]";

  if (variant === 'minimal') {
    return (
      <div 
        className="min-h-screen bg-background pt-20"
        style={{ minHeight: '100vh' }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className={`h-8 w-48 rounded-lg ${shimmerClass}`} />
          <div className={`mt-4 h-4 w-96 max-w-full rounded ${shimmerClass}`} />
        </div>
      </div>
    );
  }

  if (variant === 'product') {
    return (
      <div 
        className="min-h-screen bg-background pt-20"
        style={{ minHeight: '100vh' }}
      >
        {/* Lightweight hero skeleton */}
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16" style={{ minHeight: '250px' }}>
          <div className="flex flex-col items-center text-center gap-4">
            <div className={`h-5 w-20 rounded-full ${shimmerClass}`} />
            <div className={`h-10 sm:h-12 w-64 sm:w-80 max-w-full rounded-lg ${shimmerClass}`} />
            <div className={`h-4 w-80 sm:w-96 max-w-full rounded ${shimmerClass}`} />
          </div>
        </div>

        {/* Cards skeleton - responsive grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-40 sm:h-48 rounded-xl ${shimmerClass}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background pt-20"
      style={{ minHeight: '100vh' }}
    >
      {/* Hero skeleton */}
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24" style={{ minHeight: '350px' }}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className={`h-12 sm:h-14 md:h-16 w-64 sm:w-72 md:w-96 max-w-full rounded-lg ${shimmerClass}`} />
          <div className={`h-4 w-full max-w-sm sm:max-w-lg rounded ${shimmerClass}`} />
          <div className={`h-4 w-3/4 max-w-xs sm:max-w-md rounded ${shimmerClass}`} />
        </div>
      </div>

      {/* Cards skeleton - responsive */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-48 sm:h-56 lg:h-64 rounded-2xl ${shimmerClass}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
