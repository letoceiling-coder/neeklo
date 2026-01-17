import { motion } from "framer-motion";
import { Users, TrendingUp, Clock, CheckCircle } from "lucide-react";

export const CRMMockup = () => {
  const deals = [
    { name: "ООО Техника", amount: "450 000 ₽", stage: "Переговоры", progress: 60 },
    { name: "ИП Иванов", amount: "120 000 ₽", stage: "Счёт", progress: 80 },
    { name: "Старт-М", amount: "890 000 ₽", stage: "Новый", progress: 20 },
  ];

  return (
    <div className="relative mx-auto max-w-sm">
      <div className="relative bg-surface border border-border rounded-2xl p-3 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <p className="font-semibold text-sm text-foreground">CRM</p>
          </div>
          <div className="flex items-center gap-1 text-success">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">+24%</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { value: "47", label: "Лиды", icon: <Users className="w-3 h-3" /> },
            { value: "12", label: "В работе", icon: <Clock className="w-3 h-3" /> },
            { value: "8", label: "Закрыто", icon: <CheckCircle className="w-3 h-3" /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="bg-background rounded-lg p-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <p className="font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-foreground-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Deals list */}
        <div className="bg-background rounded-xl p-2 space-y-2">
          <p className="text-[10px] text-foreground-muted px-1">Активные сделки</p>
          {deals.map((deal, i) => (
            <motion.div
              key={i}
              className="bg-surface rounded-lg p-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <p className="font-medium text-xs text-foreground">{deal.name}</p>
                  <p className="text-[10px] text-foreground-muted">{deal.stage}</p>
                </div>
                <p className="font-semibold text-xs text-primary">{deal.amount}</p>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${deal.progress}%` }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10" />
    </div>
  );
};
