"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/common/Container";
import { Sparkles, ArrowRight, RotateCcw, ExternalLink, X } from "lucide-react";
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

// Product mapping based on selections (logic unchanged)
const getRecommendation = (selection: Selection): ProductRecommendation => {
  const { what, why } = selection;

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

  return {
    slug: "ai-agent",
    title: "AI-ассистент",
    description: "Подберём решение за вас",
    price: "от 65 000 ₽",
    timeline: "10–21 день",
    telegramLink: "https://t.me/neeklo_manager",
  };
};

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

const getProgress = (s: Step): number => {
  if (s === 1) return 33;
  if (s === 2) return 66;
  return 100;
};

const getStepLabel = (s: Step): string => {
  if (s === "result") return "Рекомендация";
  return `Шаг ${s} из 3`;
};

export function SkruticSelector() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [selection, setSelection] = useState<Selection>({
    what: null,
    why: null,
    when: null,
  });

  const recommendation = useMemo(() => {
    if (step === "result") return getRecommendation(selection);
    return null;
  }, [step, selection]);

  const liveEstimate = useMemo(
    () => getRecommendation(selection),
    [selection]
  );

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (stepNum: 1 | 2 | 3, value: string) => {
    if (stepNum === 1) {
      setSelection((prev) => ({ ...prev, what: value }));
      setStep(value === "unknown" ? "result" : 2);
    } else if (stepNum === 2) {
      setSelection((prev) => ({ ...prev, why: value }));
      setStep(3);
    } else if (stepNum === 3) {
      setSelection((prev) => ({ ...prev, when: value }));
      setStep("result");
    }
  };

  const handleReset = useCallback(() => {
    setStep(1);
    setSelection({ what: null, why: null, when: null });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleViewProduct = () => {
    if (recommendation) navigate(`/products/${recommendation.slug}`);
  };

  const handleOpenTelegram = () => {
    if (recommendation) {
      const message = encodeURIComponent(
        `Здравствуйте! Интересует ${recommendation.title}`
      );
      window.open(`${recommendation.telegramLink}?text=${message}`, "_blank");
    }
  };

  // Body scroll lock
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  // Focus close button when modal opens (for keyboard nav)
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => closeBtnRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const renderModalContent = () => {
    if (step === "result" && recommendation) {
      return (
        <motion.div
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-6 px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="space-y-2"
          >
            <p className="text-xs uppercase tracking-wider text-cyan-400 font-medium">
              Рекомендуем
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              {recommendation.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {recommendation.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
          >
            <button
              onClick={handleOpenTelegram}
              className={cn(
                "inline-flex items-center justify-center gap-2",
                "px-6 py-3.5 rounded-xl min-h-[48px]",
                "bg-cyan-400 text-black font-medium text-sm",
                "hover:bg-cyan-300 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              )}
            >
              Открыть в Telegram
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={handleViewProduct}
              className={cn(
                "inline-flex items-center justify-center gap-2",
                "px-5 py-3.5 rounded-xl min-h-[48px]",
                "bg-zinc-800 text-foreground font-medium text-sm border border-zinc-600/50",
                "hover:bg-zinc-700 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              )}
            >
              Подробнее
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
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
        className="space-y-6 px-4"
      >
        <h3 className="text-lg md:text-xl font-semibold text-foreground text-center">
          {currentStep.title}
        </h3>

        <div
          className={cn(
            "grid gap-4 max-w-md mx-auto",
            step === 3 ? "grid-cols-2" : "grid-cols-2"
          )}
        >
          {currentStep.options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.25 }}
              onClick={() => handleSelect(step as 1 | 2 | 3, option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex flex-col items-center justify-center gap-3",
                "min-h-[120px] md:min-h-[140px] p-5 rounded-2xl",
                "bg-zinc-800/80 border border-zinc-600/50",
                "hover:bg-zinc-700/80 hover:border-cyan-400/30",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                "cursor-pointer"
              )}
            >
              <span className="text-3xl md:text-4xl" role="img" aria-hidden>
                {option.emoji}
              </span>
              <span className="text-sm font-medium text-foreground">
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* CTA section: launch quiz */}
      <section className="py-8 md:py-12 relative overflow-hidden">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="max-w-lg mx-auto"
          >
            <button
              onClick={() => setIsOpen(true)}
              className={cn(
                "w-full text-left p-6 md:p-8 rounded-3xl",
                "bg-foreground/[0.02] dark:bg-white/[0.03]",
                "border border-foreground/[0.06] dark:border-white/[0.06]",
                "backdrop-blur-sm",
                "hover:bg-foreground/[0.04] dark:hover:bg-white/[0.05] hover:border-foreground/[0.1]",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              )}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
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
              <p className="text-foreground font-semibold text-center mb-2">
                Подберём решение за 3 вопроса
              </p>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Ответьте на короткий квиз — получите рекомендацию и ориентир по стоимости.
              </p>
              <span
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "px-5 py-2.5 rounded-xl",
                  "bg-primary/10 text-primary font-medium text-sm",
                  "group-hover:bg-primary/15"
                )}
              >
                Начать
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </motion.div>
        </Container>
      </section>

      {/* Fullscreen modal — рендер в body, выше хедера (z-[9999]) */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[10000] flex flex-col bg-zinc-950"
            role="dialog"
            aria-modal="true"
            aria-labelledby="skrutic-title"
          >
            {/* Sticky top bar */}
            <div className="sticky top-0 z-10 flex-shrink-0 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/50 safe-area-top">
              <div className="flex items-center justify-between px-4 py-4 md:px-6">
                <div>
                  <p
                    id="skrutic-title"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {getStepLabel(step)}
                  </p>
                  {/* Progress bar */}
                  <div className="mt-2 h-1 w-32 md:w-40 rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-cyan-400 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: getProgress(step) + "%" }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>
                </div>
                <button
                  ref={closeBtnRef}
                  onClick={handleClose}
                  className={cn(
                    "p-2.5 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center",
                    "text-muted-foreground hover:text-foreground hover:bg-zinc-800",
                    "transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  )}
                  aria-label="Закрыть"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center py-8 md:py-12">
              <AnimatePresence mode="wait">
                {renderModalContent()}
              </AnimatePresence>
            </div>

            {/* Fixed bottom: live estimate */}
            <div
              className={cn(
                "flex-shrink-0 w-full",
                "bg-zinc-900 border-t border-zinc-800/50",
                "px-4 py-4 md:px-6 md:py-5 safe-area-bottom"
              )}
            >
              <div className="max-w-lg mx-auto flex items-center justify-center gap-2 text-sm">
                <span className="font-semibold text-foreground">
                  {liveEstimate.price}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {liveEstimate.timeline}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
}
