import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const shouldReduceMotion = usePrefersReducedMotion();
  
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10",
        "rounded-full transition-colors duration-200",
        "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
      )}
      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      aria-label={`Переключить на ${isDark ? 'светлую' : 'тёмную'} тему`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : 180,
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-[18px] h-[18px] text-primary" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? -180 : 0,
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center"
      >
        <Sun className="w-[18px] h-[18px] text-yellow-500" />
      </motion.div>
    </motion.button>
  );
};
