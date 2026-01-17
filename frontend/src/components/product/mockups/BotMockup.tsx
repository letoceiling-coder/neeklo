import { motion } from "framer-motion";
import { Send } from "lucide-react";

export const BotMockup = () => {
  const commands = [
    { cmd: "/start", desc: "Начать работу" },
    { cmd: "/catalog", desc: "Каталог товаров" },
    { cmd: "/order", desc: "Мои заказы" },
    { cmd: "/help", desc: "Помощь" },
  ];

  return (
    <div className="relative mx-auto max-w-sm">
      <div className="relative bg-surface border border-border rounded-[2.5rem] p-2 shadow-2xl">
        <div className="bg-background rounded-[2rem] overflow-hidden">
          {/* Telegram header */}
          <div className="bg-[#2AABEE]/10 px-4 py-3 flex items-center gap-3 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-[#2AABEE] flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">Shop Bot</p>
              <p className="text-xs text-foreground-muted">bot</p>
            </div>
          </div>

          {/* Commands */}
          <div className="p-4 space-y-2 min-h-[280px]">
            <motion.div
              className="bg-surface border border-border rounded-xl p-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs text-foreground-muted mb-2">Доступные команды:</p>
              {commands.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 py-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <span className="text-[#2AABEE] font-mono text-sm">{item.cmd}</span>
                  <span className="text-foreground-muted text-xs">— {item.desc}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="bg-[#2AABEE] text-white rounded-2xl rounded-bl-md px-4 py-2.5 text-sm max-w-[85%]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              Привет! 👋 Я бот магазина. Выберите команду или напишите вопрос.
            </motion.div>
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border flex gap-2">
            <div className="flex-1 bg-surface rounded-full px-4 py-2.5 text-sm text-foreground-muted">
              Сообщение...
            </div>
            <div className="w-10 h-10 rounded-full bg-[#2AABEE] flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -inset-4 bg-[#2AABEE]/10 rounded-[3rem] blur-2xl -z-10" />
    </div>
  );
};
