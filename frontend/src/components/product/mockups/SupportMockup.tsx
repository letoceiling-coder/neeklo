import { motion } from "framer-motion";
import { Headphones, CheckCircle, Clock, AlertCircle } from "lucide-react";

export const SupportMockup = () => {
  const tickets = [
    { id: "#1247", title: "Ошибка оплаты", status: "resolved", time: "2ч назад" },
    { id: "#1248", title: "Вопрос по API", status: "active", time: "15м назад" },
    { id: "#1249", title: "Обновление", status: "pending", time: "Только что" },
  ];

  const statusConfig = {
    resolved: { icon: <CheckCircle className="w-3.5 h-3.5" />, color: "text-success bg-success/10" },
    active: { icon: <Clock className="w-3.5 h-3.5" />, color: "text-primary bg-primary/10" },
    pending: { icon: <AlertCircle className="w-3.5 h-3.5" />, color: "text-orange-500 bg-orange-500/10" },
  };

  return (
    <div className="relative mx-auto max-w-sm">
      <div className="relative bg-surface border border-border rounded-2xl p-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
            <Headphones className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Техподдержка</p>
            <p className="text-xs text-success">Онлайн • SLA 99.9%</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { value: "< 1ч", label: "Ответ" },
            { value: "98%", label: "Решено" },
            { value: "24/7", label: "Доступность" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="bg-background rounded-lg p-2 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <p className="font-bold text-sm text-foreground">{stat.value}</p>
              <p className="text-[10px] text-foreground-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tickets */}
        <div className="bg-background rounded-xl p-3 space-y-2">
          <p className="text-xs text-foreground-muted mb-1">Последние тикеты</p>
          {tickets.map((ticket, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-between bg-surface rounded-lg p-2.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${statusConfig[ticket.status as keyof typeof statusConfig].color}`}>
                  {statusConfig[ticket.status as keyof typeof statusConfig].icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{ticket.title}</p>
                  <p className="text-[10px] text-foreground-muted">{ticket.id}</p>
                </div>
              </div>
              <span className="text-[10px] text-foreground-muted">{ticket.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute -inset-4 bg-success/10 rounded-3xl blur-2xl -z-10" />
    </div>
  );
};
