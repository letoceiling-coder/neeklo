import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  minDisplayTime?: number;
}

export const PageLoader = memo(function PageLoader({ minDisplayTime = 400 }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Fast start, slow middle, fast end
        const increment = prev < 30 ? 8 : prev < 70 ? 3 : prev < 90 ? 5 : 10;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    // Force complete after minDisplayTime regardless of document state
    const completeLoader = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);
      
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setIsComplete(true), 200);
        setTimeout(() => setIsVisible(false), 500);
      }, remaining);
    };

    // Check if document is ready or force complete after timeout
    if (document.readyState === 'complete') {
      completeLoader();
    } else {
      window.addEventListener('load', completeLoader);
      // Fallback: force complete after 2 seconds max
      const fallbackTimeout = setTimeout(completeLoader, 2000);
      
      return () => {
        clearInterval(progressInterval);
        window.removeEventListener('load', completeLoader);
        clearTimeout(fallbackTimeout);
      };
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, [minDisplayTime]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Logo / Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <span className="text-3xl font-bold tracking-tight">
              <span className="text-gradient-primary">neeklo</span>
              <span className="text-foreground/80">.studio</span>
            </span>
          </motion.div>

          {/* Progress Bar Container */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-64 md:w-80"
          >
            {/* Track */}
            <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-muted/30">
              {/* Progress Fill */}
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
                  boxShadow: '0 0 20px hsl(var(--primary) / 0.5)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '400%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>

            {/* Percentage */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-center text-sm text-foreground-muted"
            >
              {isComplete ? 'Готово' : `${Math.round(progress)}%`}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
