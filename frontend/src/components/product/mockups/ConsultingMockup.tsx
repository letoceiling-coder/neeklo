import { motion } from "framer-motion";
import { Lightbulb, Target, TrendingUp, Calendar } from "lucide-react";

export const ConsultingMockup = () => {
  const roadmapItems = [
    { phase: "Q1", title: "Аудит", done: true },
    { phase: "Q2", title: "Стратегия", done: true },
    { phase: "Q3", title: "Запуск", done: false },
    { phase: "Q4", title: "Масштаб", done: false },
  ];

  return (
    <div className="relative mx-auto max-w-sm">
      <div className="relative bg-surface border border-border rounded-2xl p-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Консалтинг</p>
            <p className="text-xs text-foreground-muted">Digital-стратегия</p>
          </div>
        </div>

        {/* Roadmap */}
        <motion.div
          className="bg-background rounded-xl p-3 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium text-foreground">Roadmap 2024</p>
          </div>
          <div className="flex justify-between relative">
            {/* Progress line */}
            <div className="absolute top-3 left-0 right-0 h-0.5 bg-border" />
            <motion.div
              className="absolute top-3 left-0 h-0.5 bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "50%" }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
            
            {roadmapItems.map((item, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    item.done
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface border border-border text-foreground-muted"
                  }`}
                >
                  {item.done ? "✓" : i + 1}
                </div>
                <p className="text-[10px] text-foreground mt-1 font-medium">{item.phase}</p>
                <p className="text-[9px] text-foreground-muted">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <motion.div
            className="bg-background rounded-xl p-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-[10px] text-foreground-muted">Рост</span>
            </div>
            <p className="text-xl font-bold text-success">+47%</p>
          </motion.div>
          <motion.div
            className="bg-background rounded-xl p-3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-[10px] text-foreground-muted">Встреча</span>
            </div>
            <p className="text-sm font-medium text-foreground">Завтра, 14:00</p>
          </motion.div>
        </div>
      </div>
      <div className="absolute -inset-4 bg-amber-500/10 rounded-3xl blur-2xl -z-10" />
    </div>
  );
};
