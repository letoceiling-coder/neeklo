import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface Message {
  type: "bot" | "user";
  text: string;
}

interface ChatMockupProps {
  messages?: Message[];
  companyName?: string;
}

const defaultMessages: Message[] = [
  { type: "user", text: "Привет! Хочу узнать о доставке" },
  { type: "bot", text: "Здравствуйте! Доставка по Москве 1-2 дня, по России 3-7 дней. Могу оформить заказ?" },
  { type: "user", text: "Да, давайте" },
  { type: "bot", text: "Отлично! Пришлите номер телефона, менеджер свяжется в течение 5 минут 📞" },
];

export const ChatMockup = ({ 
  messages = defaultMessages,
  companyName = "AI Агент"
}: ChatMockupProps) => {
  return (
    <div className="relative mx-auto max-w-sm">
      {/* Phone frame */}
      <div className="relative bg-surface border border-border rounded-[2.5rem] p-2 shadow-2xl">
        {/* Screen */}
        <div className="bg-background rounded-[2rem] overflow-hidden">
          {/* Header */}
          <div className="bg-primary/10 px-4 py-3 flex items-center gap-3 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{companyName}</p>
              <p className="text-xs text-success">Онлайн</p>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 min-h-[280px] max-h-[320px] overflow-hidden">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3 + 0.5 }}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-surface border border-border text-foreground rounded-bl-md"
                  }`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border">
            <div className="bg-surface rounded-full px-4 py-2.5 text-sm text-foreground-muted">
              Написать сообщение...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
