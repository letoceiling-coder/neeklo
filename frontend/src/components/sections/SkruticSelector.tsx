"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/common/Container";
import { Sparkles, ArrowRight, RotateCcw, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Types
type Step = 1 | 2 | 3 | "result";

interface Selection {
  what: string | null;
  why: string | null;
  when: string | null;
}

interface ProductRecommendation {
  slug: string;
  title: string;
  description: string;
  price: string;
  timeline: string;
  telegramLink: string;
}

// Product mapping based on selections
const getRecommendation = (selection: Selection): ProductRecommendation => {
  const { what, why } = selection;

  // Website recommendations
  if (what === "site") {
    if (why === "leads" || why === "sales") {
      return {
        slug: "website",
        title: "Сайт для заявок",
        description: "Лендинг с формой захвата",
        price: "от 45 000 ₽",
        timeline: "5–14 дней",
        telegramLink: "https://t.me/neeklo_manager",
      };
    }
    return {
      slug: "website",
      title: "Корпоративный сайт",
      description: "Имиджевый сайт для бизнеса",
      price: "от 120 000 ₽",
      timeline: "10–21 день",
      telegramLink: "https://t.me/neeklo_manager",
    };
  }

  // Bot recommendations
  if (what === "bot") {
    if (why === "automation") {
      return {
        slug: "telegram-bot",
        title: "Бот для автоматизации",
        description: "CRM + рассылки + оплата",
        price: "от 65 000 ₽",
        timeline: "7–14 дней",
        telegramLink: "https://t.me/neeklo_manager",
      };
    }
    return {
      slug: "telegram-bot",
      title: "Telegram-бот для заявок",
      description: "Приём заказов 24/7",
      price: "от 35 000 ₽",
      timeline: "5–14 дней",
      telegramLink: "https://t.me/neeklo_manager",
    };
  }

  // Video recommendations
  if (what === "video") {
    if (why === "sales") {
      return {
        slug: "ai-video",
        title: "Видео для продаж",
        description: "Reels и промо с AI",
        price: "от 25 000 ₽",
        timeline: "3–7 дней",
        telegramLink: "https://t.me/neeklo_manager",
      };
    }
    return {
      slug: "ai-video",
      title: "AI-видео для бренда",
      description: "Контент для соцсетей",
      price: "от 25 000 ₽",
      timeline: "3–7 дней",
      telegramLink: "https://t.me/neeklo_manager",
    };
  }

  // Default: don't know - show catalog or AI agent
  return {
    slug: "ai-agent",
    title: "AI-ассистент",
    description: "Подберём решение за вас",
    price: "от 65 000 ₽",
    timeline: "10–21 день",
    telegramLink: "https://t.me/neeklo_manager",
  };
};

// Step configs
const steps = {
  1: {
    title: "Что хотите сделать?",
    options: [
      { id: "site", label: "Сайт", emoji: "🌐" },
      { id: "bot", label: "Бот", emoji: "🤖" },
      { id: "video", label: "Видео", emoji: "🎬" },
      { id: "unknown", label: "Не знаю", emoji: "✨" },
    ],
  },
  2: {
    title: "Для какой задачи?",
    options: [
      { id: "leads", label: "Заявки", emoji: "📩" },
      { id: "sales", label: "Продажи", emoji: "💰" },
      { id: "image", label: "Имидж", emoji: "✨" },
      { id: "automation", label: "Автоматизация", emoji: "⚡" },
    ],
  },
  3: {
    title: "Насколько срочно?",
    options: [
      { id: "urgent", label: "Срочно", emoji: "🚀" },
      { id: "normal", label: "Можно подождать", emoji: "📅" },
    ],
  },
};

export function SkruticSelector() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [selection, setSelection] = useState<Selection>({
    what: null,
    why: null,
    when: null,
  });

  const recommendation = useMemo(() => {
    if (step === "result") {
      return getRecommendation(selection);
    }
    return null;
  }, [step, selection]);

  const handleSelect = (stepNum: 1 | 2 | 3, value: string) => {
    if (stepNum === 1) {
      setSelection((prev) => ({ ...prev, what: value }));
      if (value === "unknown") {
        setStep("result");
      } else {
        setStep(2);
      }
    } else if (stepNum === 2) {
      setSelection((prev) => ({ ...prev, why: value }));
      setStep(3);
    } else if (stepNum === 3) {
      setSelection((prev) => ({ ...prev, when: value }));
      setStep("result");
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelection({ what: null, why: null, when: null });
  };

  const handleViewProduct = () => {
    if (recommendation) {
      navigate(`/products/${recommendation.slug}`);
    }
  };

  const handleOpenTelegram = () => {
    if (recommendation) {
      const message = encodeURIComponent(
        `Здравствуйте! Интересует ${recommendation.title}`
      );
      window.open(`${recommendation.telegramLink}?text=${message}`, "_blank");
    }
  };

  const renderStepContent = () => {
    if (step === "result" && recommendation) {
      return (
        <motion.div
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-5"
        >
          {/* Recommendation header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="space-y-1"
          >
            <p className="text-xs uppercase tracking-wider text-primary font-medium">
              Рекомендуем
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              {recommendation.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {recommendation.description}
            </p>
          </motion.div>

          {/* Price & timeline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="flex items-center justify-center gap-3 text-sm"
          >
            <span className="text-lg font-semibold text-foreground">
              {recommendation.price}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {recommendation.timeline}
            </span>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
          >
            <button
              onClick={handleOpenTelegram}
              className={cn(
                "inline-flex items-center justify-center gap-2",
                "px-6 py-3 rounded-xl",
                "bg-primary text-primary-foreground",
                "font-medium text-sm",
                "hover:bg-primary/90 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              )}
            >
              Открыть в Telegram
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={handleViewProduct}
              className={cn(
                "inline-flex items-center justify-center gap-2",
                "px-5 py-3 rounded-xl",
                "bg-foreground/5 dark:bg-white/10 text-foreground",
                "font-medium text-sm",
                "hover:bg-foreground/10 dark:hover:bg-white/15 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              )}
            >
              Подробнее
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Reset button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
          >
            <RotateCcw className="w-3 h-3" />
            Начать заново
          </motion.button>
        </motion.div>
      );
    }

    const currentStep = steps[step as 1 | 2 | 3];
    if (!currentStep) return null;

    return (
      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="text-center space-y-5"
      >
        {/* Step title */}
        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-lg md:text-xl font-semibold text-foreground"
        >
          {currentStep.title}
        </motion.h3>

        {/* Options grid */}
        <div
          className={cn(
            "grid gap-3",
            step === 3 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
          )}
        >
          {currentStep.options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.06, duration: 0.25 }}
              onClick={() => handleSelect(step as 1 | 2 | 3, option.id)}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={cn(
                "flex flex-col items-center justify-center gap-2",
                "p-4 md:p-5 rounded-2xl",
                "bg-foreground/[0.03] dark:bg-white/[0.05]",
                "border border-foreground/[0.08] dark:border-white/[0.08]",
                "hover:bg-primary/10 hover:border-primary/30",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                "group cursor-pointer"
              )}
            >
              <span className="text-2xl md:text-3xl">{option.emoji}</span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center justify-center gap-1.5 pt-2"
        >
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-200",
                s === step
                  ? "bg-primary"
                  : s < (step as number)
                  ? "bg-primary/40"
                  : "bg-foreground/10 dark:bg-white/10"
              )}
            />
          ))}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <section className="py-8 md:py-12 relative overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="max-w-lg mx-auto"
        >
          {/* Glass card */}
          <div
            className={cn(
              "relative p-6 md:p-8",
              "rounded-3xl",
              "bg-foreground/[0.02] dark:bg-white/[0.03]",
              "border border-foreground/[0.06] dark:border-white/[0.06]",
              "backdrop-blur-sm"
            )}
          >
            {/* Scrootie badge */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <div
                className={cn(
                  "w-8 h-8 rounded-xl",
                  "bg-primary/10 dark:bg-primary/15",
                  "border border-primary/20",
                  "flex items-center justify-center"
                )}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Скрутик
              </span>
            </div>

            {/* Step content with animation */}
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
