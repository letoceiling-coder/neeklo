import { motion } from "framer-motion";
import { Home, Search, User, Bell, Heart } from "lucide-react";

export const MobileMockup = () => {
  return (
    <div className="relative mx-auto max-w-[280px]">
      <div className="relative bg-surface border-4 border-gray-800 rounded-[3rem] p-1 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl z-10" />
        
        <div className="bg-background rounded-[2.5rem] overflow-hidden">
          {/* Status bar */}
          <div className="h-8 px-6 flex items-center justify-between text-[10px] text-foreground-muted">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 border border-foreground-muted rounded-sm">
                <div className="w-3/4 h-full bg-foreground-muted rounded-sm" />
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="px-4 pb-4">
            {/* Header */}
            <motion.div
              className="flex items-center justify-between mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div>
                <p className="text-xs text-foreground-muted">Добро пожаловать</p>
                <p className="font-semibold text-foreground">Иван 👋</p>
              </div>
              <div className="relative">
                <Bell className="w-5 h-5 text-foreground" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
              </div>
            </motion.div>

            {/* Search */}
            <motion.div
              className="bg-surface rounded-xl px-3 py-2.5 flex items-center gap-2 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Search className="w-4 h-4 text-foreground-muted" />
              <span className="text-xs text-foreground-muted">Поиск...</span>
            </motion.div>

            {/* Featured card */}
            <motion.div
              className="relative bg-gradient-to-br from-primary to-accent rounded-2xl p-4 mb-4 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-white/80 text-xs mb-1">Специальное предложение</p>
              <p className="text-white font-bold text-lg mb-2">Скидка 30%</p>
              <div className="w-16 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary">Забрать</span>
              </div>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
            </motion.div>

            {/* Grid items */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="bg-surface rounded-xl p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 mb-2" />
                  <div className="w-16 h-2 bg-foreground/20 rounded mb-1" />
                  <div className="w-10 h-1.5 bg-foreground-muted/30 rounded" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tab bar */}
          <div className="px-6 py-3 border-t border-border flex justify-between">
            {[Home, Search, Heart, User].map((Icon, i) => (
              <motion.div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  i === 0 ? "bg-primary text-primary-foreground" : "text-foreground-muted"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.05 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            ))}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pb-2">
            <div className="w-32 h-1 bg-foreground/20 rounded-full" />
          </div>
        </div>
      </div>
      <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-[3.5rem] blur-2xl -z-10" />
    </div>
  );
};
