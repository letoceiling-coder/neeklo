"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Globe, Video, Bot, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { BriefWizard, Attachment } from "./BriefWizard";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";

const SCENARIO_CHIPS = [
  { 
    label: "Создать веб-сайт", 
    value: "Хочу создать современный веб-сайт для бизнеса",
    icon: Globe 
  },
  { 
    label: "Заказать видео", 
    value: "Нужно создать продающее видео для бизнеса",
    icon: Video 
  },
  { 
    label: "Создать чат-бота", 
    value: "Хочу создать чат-бота для автоматизации общения с клиентами",
    icon: Bot 
  },
  { 
    label: "Mini App в ТГ", 
    value: "Нужно создать Mini App в Telegram для продаж",
    icon: Smartphone 
  },
];

export function PremiumHeroInput() {
  const [value, setValue] = useState("");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [attachments] = useState<Attachment[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 48,
    maxHeight: 80,
  });

  const handleOpenWizard = useCallback(() => {
    setIsWizardOpen(true);
  }, []);

  const handleChipClick = useCallback((promptValue: string) => {
    setValue(promptValue);
    setTimeout(() => setIsWizardOpen(true), 150);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      handleOpenWizard();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full max-w-xl mx-auto px-5 sm:px-6">
        
        {/* Badge - Minimal & Premium */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 sm:mb-8"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium text-primary/80 border border-primary/15 bg-primary/5">
            <Sparkles className="w-3 h-3 opacity-60" />
            AI-конструктор решений
          </span>
        </motion.div>

        {/* Main Headline - Premium Typography */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-4 sm:mb-5"
        >
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.05] tracking-[-0.02em]">
            Готовые{" "}
            <span className="text-gradient-cyan-purple">
              решения
            </span>
            <br />
            для бизнеса
          </h1>
        </motion.div>

        {/* Subheadline - Short & Light */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-base text-muted-foreground/70 text-center mb-8 sm:mb-10 font-light tracking-wide"
        >
          Опишите свою задачу
        </motion.p>

        {/* Premium Input Container */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative mb-6 sm:mb-8"
        >
          {/* Subtle Background Glow */}
          <motion.div 
            className="absolute -inset-4 sm:-inset-6 pointer-events-none"
            animate={{ opacity: isFocused ? 0.5 : 0.2 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-2xl" />
          </motion.div>

          {/* Main Input */}
          <div
            className={cn(
              "relative flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl transition-all duration-300",
              "bg-surface/80 backdrop-blur-sm",
              "border",
              isFocused 
                ? "border-primary/25 shadow-[0_0_30px_-10px_hsl(var(--primary)/0.25)]" 
                : "border-border/50 hover:border-border"
            )}
          >
            {/* AI Icon - Subtle */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary/50" />
            </div>
            
            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Создание Mini App в телеграм…"
              className={cn(
                "flex-1 bg-transparent border-none",
                "text-foreground text-sm sm:text-base font-light",
                "placeholder:text-muted-foreground/40",
                "focus:outline-none focus:ring-0",
                "min-w-0"
              )}
            />

            {/* Submit Button - Embedded */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenWizard}
              className={cn(
                "h-8 sm:h-9 px-3 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 flex-shrink-0",
                "bg-primary text-primary-foreground font-medium text-xs sm:text-sm",
                "hover:bg-primary/90 transition-colors"
              )}
            >
              <span>Получить</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Scenario Chips - Pill Style */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {SCENARIO_CHIPS.map((chip, index) => {
              const Icon = chip.icon;
              return (
                <motion.button
                  key={chip.label}
                  onClick={() => handleChipClick(chip.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full",
                    "text-[11px] sm:text-xs font-normal",
                    "bg-transparent hover:bg-surface/60",
                    "text-muted-foreground/60 hover:text-muted-foreground",
                    "transition-all duration-200"
                  )}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-50" />
                  <span>{chip.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      <BriefWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        initialInput={value}
        attachments={attachments}
      />
    </>
  );
}
