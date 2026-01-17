import { motion } from "framer-motion";
import { Zap, ArrowRight, Check, Clock, Mail, Database } from "lucide-react";

export const AutomationMockup = () => {
  const steps = [
    { icon: <Mail className="w-4 h-4" />, label: "Заявка", status: "done" },
    { icon: <Database className="w-4 h-4" />, label: "CRM", status: "done" },
    { icon: <Zap className="w-4 h-4" />, label: "Обработка", status: "active" },
    { icon: <Check className="w-4 h-4" />, label: "Готово", status: "pending" },
  ];

  return (
    <div className="relative mx-auto max-w-sm">
      <div className="relative bg-surface border border-border rounded-2xl p-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Автоматизация</p>
            <p className="text-xs text-success">Активно</p>
          </div>
        </div>

        {/* Pipeline visualization */}
        <div className="bg-background rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.2 }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                    step.status === "done"
                      ? "bg-success text-white"
                      : step.status === "active"
                      ? "bg-primary text-primary-foreground animate-pulse"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.status === "done" ? <Check className="w-4 h-4" /> : step.icon}
                </div>
                <span className="text-[10px] text-foreground-muted">{step.label}</span>
                {i < steps.length - 1 && (
                  <motion.div
                    className="absolute"
                    style={{ left: `${25 + i * 25}%`, top: "50%" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.2 }}
                  >
                    <ArrowRight className="w-3 h-3 text-border" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "847", label: "Обработано" },
            { value: "12с", label: "Среднее время" },
            { value: "99%", label: "Успех" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="bg-background rounded-lg p-2 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
            >
              <p className="font-bold text-lg text-foreground">{stat.value}</p>
              <p className="text-[10px] text-foreground-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10" />
    </div>
  );
};
