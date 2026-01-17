"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Loader2, X, 
  CheckCircle2, MessageCircle, Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

// Types
interface WizardOption {
  id: string;
  emoji: string;
  label: string;
  description?: string;
  priceModifier?: number;
  timeModifier?: number;
}

interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  type: "single" | "multi" | "text" | "textarea";
  options?: WizardOption[];
  placeholder?: string;
  required?: boolean;
}

interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

interface ProductWizardProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productSlug: string;
  packages: Package[];
  telegramLink: string;
}

// Extract base price from string like "от 65 000 ₽"
const extractPrice = (priceStr: string): number => {
  const match = priceStr.match(/[\d\s]+/);
  if (match) {
    return parseInt(match[0].replace(/\s/g, ''), 10);
  }
  return 0;
};

// Format price with spaces
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Product-specific features
function getProductFeatures(slug: string): WizardOption[] {
  const featureMap: Record<string, WizardOption[]> = {
    "ai-agent": [
      { id: "voice", emoji: "🎙️", label: "Голосовой бот", priceModifier: 25, timeModifier: 7 },
      { id: "crm", emoji: "📊", label: "Интеграция CRM", priceModifier: 15, timeModifier: 3 },
      { id: "analytics", emoji: "📈", label: "Аналитика", priceModifier: 10, timeModifier: 2 },
      { id: "multilang", emoji: "🌐", label: "Мультиязычность", priceModifier: 20, timeModifier: 5 },
    ],
    "telegram-bot": [
      { id: "payments", emoji: "💳", label: "Приём оплаты", priceModifier: 20, timeModifier: 3 },
      { id: "catalog", emoji: "🛍️", label: "Каталог товаров", priceModifier: 15, timeModifier: 4 },
      { id: "crm", emoji: "📊", label: "Интеграция CRM", priceModifier: 15, timeModifier: 3 },
      { id: "broadcast", emoji: "📢", label: "Рассылки", priceModifier: 10, timeModifier: 2 },
    ],
    "website": [
      { id: "cms", emoji: "✏️", label: "CMS-панель", priceModifier: 20, timeModifier: 5 },
      { id: "seo", emoji: "🔍", label: "SEO-пакет", priceModifier: 15, timeModifier: 3 },
      { id: "multilang", emoji: "🌐", label: "Мультиязычность", priceModifier: 25, timeModifier: 7 },
      { id: "animation", emoji: "✨", label: "Анимации", priceModifier: 10, timeModifier: 3 },
    ],
    "ai-video": [
      { id: "avatar", emoji: "🧑‍💼", label: "AI-аватар", priceModifier: 30, timeModifier: 5 },
      { id: "voice", emoji: "🎤", label: "Озвучка", priceModifier: 15, timeModifier: 2 },
      { id: "subtitles", emoji: "💬", label: "Субтитры", priceModifier: 10, timeModifier: 1 },
      { id: "music", emoji: "🎵", label: "Музыка", priceModifier: 5, timeModifier: 1 },
    ],
    "default": [
      { id: "support", emoji: "🛡️", label: "Поддержка", priceModifier: 15, timeModifier: 0 },
      { id: "priority", emoji: "⚡", label: "Приоритет", priceModifier: 20, timeModifier: -5 },
      { id: "training", emoji: "📚", label: "Обучение", priceModifier: 10, timeModifier: 2 },
      { id: "docs", emoji: "📝", label: "Документация", priceModifier: 5, timeModifier: 1 },
    ],
  };

  return featureMap[slug] || featureMap["default"];
}

// Generate wizard steps
const generateSteps = (productSlug: string): WizardStep[] => {
  return [
    {
      id: "need",
      title: "Что нужно?",
      subtitle: "Выберите тип задачи",
      type: "single",
      required: true,
      options: [
        { id: "new", emoji: "🚀", label: "Новый проект", description: "Создать с нуля" },
        { id: "improve", emoji: "✨", label: "Улучшить", description: "Доработать существующее" },
        { id: "fix", emoji: "🔧", label: "Исправить", description: "Починить или переделать" },
        { id: "consult", emoji: "💡", label: "Консультация", description: "Обсудить идею" },
      ],
    },
    {
      id: "details",
      title: "Детали проекта",
      subtitle: "Расскажите о задаче",
      type: "textarea",
      placeholder: "Опишите что нужно сделать, какие функции важны, есть ли референсы...",
      required: true,
    },
    {
      id: "features",
      title: "Дополнительные опции",
      subtitle: "Выберите нужное (необязательно)",
      type: "multi",
      required: false,
      options: getProductFeatures(productSlug),
    },
    {
      id: "budget",
      title: "Бюджет и сроки",
      subtitle: "Ваши ожидания",
      type: "single",
      required: true,
      options: [
        { id: "minimal", emoji: "💰", label: "Минимальный", description: "Базовый функционал", priceModifier: -20, timeModifier: -5 },
        { id: "standard", emoji: "💎", label: "Стандартный", description: "Оптимальное решение", priceModifier: 0, timeModifier: 0 },
        { id: "premium", emoji: "👑", label: "Премиум", description: "Максимум возможностей", priceModifier: 40, timeModifier: 10 },
        { id: "flexible", emoji: "🤝", label: "Обсудим", description: "Гибкий подход", priceModifier: 0, timeModifier: 0 },
      ],
    },
    {
      id: "contact",
      title: "Как связаться?",
      subtitle: "Telegram, WhatsApp или телефон",
      type: "text",
      placeholder: "@username или +7...",
      required: true,
    },
  ];
};

export function ProductWizard({ 
  isOpen, 
  onClose, 
  productTitle, 
  productSlug, 
  packages, 
  telegramLink 
}: ProductWizardProps) {
  const steps = useMemo(() => generateSteps(productSlug), [productSlug]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selectedPackage, setSelectedPackage] = useState<string>(packages[1]?.id || packages[0]?.id || "");
  const [isSending, setIsSending] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  // Check if can proceed
  const canProceed = useMemo(() => {
    if (!step.required) return true;
    const answer = answers[step.id];
    if (Array.isArray(answer)) return answer.length > 0;
    return answer && answer.toString().trim().length > 0;
  }, [step, answers]);

  // Calculate price
  const calculatedPrice = useMemo(() => {
    const pkg = packages.find(p => p.id === selectedPackage);
    if (!pkg) return { base: 0, total: 0, modifiers: [] as string[] };

    const basePrice = extractPrice(pkg.price);
    let totalModifier = 0;
    const modifiers: string[] = [];

    Object.entries(answers).forEach(([stepId, value]) => {
      const stepConfig = steps.find(s => s.id === stepId);
      if (!stepConfig?.options) return;

      const values = Array.isArray(value) ? value : [value];
      values.forEach(v => {
        const option = stepConfig.options?.find(o => o.id === v);
        if (option?.priceModifier) {
          totalModifier += option.priceModifier;
          modifiers.push(`${option.label}: ${option.priceModifier > 0 ? '+' : ''}${option.priceModifier}%`);
        }
      });
    });

    const total = Math.round(basePrice * (1 + totalModifier / 100));
    return { base: basePrice, total, modifiers };
  }, [answers, selectedPackage, packages, steps]);

  // Calculate timeline
  const calculatedTimeline = useMemo(() => {
    const pkg = packages.find(p => p.id === selectedPackage);
    if (!pkg) return 14;

    const timelineFeature = pkg.features.find(f => f.includes("дн") || f.includes("день"));
    let baseDays = 14;
    if (timelineFeature) {
      const match = timelineFeature.match(/(\d+)/);
      if (match) baseDays = parseInt(match[1], 10);
    }

    let modifier = 0;
    Object.entries(answers).forEach(([stepId, value]) => {
      const stepConfig = steps.find(s => s.id === stepId);
      if (!stepConfig?.options) return;

      const values = Array.isArray(value) ? value : [value];
      values.forEach(v => {
        const option = stepConfig.options?.find(o => o.id === v);
        if (option?.timeModifier) {
          modifier += option.timeModifier;
        }
      });
    });

    return Math.max(5, baseDays + modifier);
  }, [answers, selectedPackage, packages, steps]);

  const handleSingleSelect = useCallback((value: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }));
    
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }, 300);
  }, [step, currentStep, steps.length]);

  const handleMultiSelect = useCallback((value: string) => {
    setAnswers(prev => {
      const current = (prev[step.id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [step.id]: updated };
    });
  }, [step]);

  const handleTextChange = useCallback((value: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }));
  }, [step]);

  const handleNext = () => {
    if (canProceed && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (isLastStep && canProceed) {
      setShowSummary(true);
    }
  };

  const handleBack = () => {
    if (showSummary) {
      setShowSummary(false);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSending(true);
    try {
      const pkg = packages.find(p => p.id === selectedPackage);
      
      const summaryParts = [
        `🎯 ${productTitle}`,
        `📦 Тариф: ${pkg?.name}`,
        `💰 Расчёт: от ${formatPrice(calculatedPrice.total)} ₽`,
        `⏱️ Срок: ~${calculatedTimeline} дней`,
        "",
      ];

      Object.entries(answers).forEach(([stepId, value]) => {
        const stepConfig = steps.find(s => s.id === stepId);
        if (!stepConfig) return;

        if (stepConfig.type === "text" || stepConfig.type === "textarea") {
          summaryParts.push(`• ${stepConfig.title}: ${value}`);
        } else if (stepConfig.options) {
          const values = Array.isArray(value) ? value : [value];
          const labels = values.map(v => {
            const opt = stepConfig.options?.find(o => o.id === v);
            return opt ? `${opt.emoji} ${opt.label}` : v;
          });
          summaryParts.push(`• ${stepConfig.title}: ${labels.join(", ")}`);
        }
      });

      const message = encodeURIComponent(summaryParts.join("\n"));
      window.open(`${telegramLink}?text=${message}`, "_blank");

      toast({
        title: "Отлично!",
        description: "Открываем Telegram для связи",
      });

      setTimeout(onClose, 1000);
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Ошибка",
        description: "Попробуйте ещё раз",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && step.type === "text") {
      e.preventDefault();
      handleNext();
    }
  };

  // Render summary
  const renderSummary = () => {
    const pkg = packages.find(p => p.id === selectedPackage);
    const contactValue = (answers.contact as string) || "";
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-5"
      >
        {/* Header badge */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-primary font-medium text-sm sm:text-base">Заявка готова</span>
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-bold">Итоговый расчёт</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">Проверьте данные и свяжитесь с нами</p>
        </div>

        {/* Price card - matching reference design */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-border shadow-xl"
        >
          <div className="text-center space-y-0.5 sm:space-y-1">
            <p className="text-xs sm:text-sm text-muted-foreground">Примерная стоимость</p>
            <p className="text-3xl sm:text-4xl font-bold text-primary">
              от {formatPrice(calculatedPrice.total)} ₽
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Срок: ~{calculatedTimeline} дней
            </p>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Тариф {pkg?.name}:</span>
              <span className="text-foreground">{formatPrice(calculatedPrice.base)} ₽</span>
            </div>
            {calculatedPrice.modifiers.map((mod, idx) => (
              <div key={idx} className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground truncate mr-2">{mod.split(':')[0]}:</span>
                <span className="text-foreground/80 shrink-0">{mod.split(':')[1]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Package selector */}
        <div className="space-y-1.5 sm:space-y-2">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">Выберите тариф:</p>
          <div className="grid gap-1.5 sm:gap-2">
            {packages.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPackage(p.id)}
                className={cn(
                  "p-2.5 sm:p-3 rounded-lg sm:rounded-xl border text-left transition-all",
                  selectedPackage === p.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-xs sm:text-sm">{p.name}</p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground truncate">{p.description}</p>
                  </div>
                  <p className="font-semibold text-primary text-xs sm:text-sm shrink-0">{p.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contact input in summary */}
        <div className="space-y-1.5 sm:space-y-2">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">Ваш контакт:</p>
          <Input
            value={contactValue}
            onChange={(e) => setAnswers(prev => ({ ...prev, contact: e.target.value }))}
            placeholder="@username, телефон или email"
            className="h-10 sm:h-12 text-sm"
          />
        </div>

        {/* Contact buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSending || !contactValue.trim()}
            className={cn(
              "flex items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg sm:rounded-xl text-white transition-colors text-sm sm:text-base",
              contactValue.trim() 
                ? "bg-[#0088cc] hover:bg-[#0088cc]/90" 
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <>
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium">Telegram</span>
              </>
            )}
          </button>
          <a
            href={`https://wa.me/79999999999?text=${encodeURIComponent(`Заявка на ${productTitle}\nКонтакт: ${contactValue}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-[#25D366] text-white hover:bg-[#25D366]/90 transition-colors text-sm sm:text-base"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium">WhatsApp</span>
          </a>
        </div>

        {/* Collapsible summary */}
        <details className="group">
          <summary className="text-xs sm:text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors list-none flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-open:rotate-90" />
            Показать детали заявки
          </summary>
          <div className="mt-2 sm:mt-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/30 border border-border/50 space-y-1.5 sm:space-y-2">
            {Object.entries(answers).map(([stepId, value]) => {
              const stepConfig = steps.find(s => s.id === stepId);
              if (!stepConfig || !value || stepId === "contact") return null;
              
              let displayValue = "";
              if (stepConfig.type === "text" || stepConfig.type === "textarea") {
                displayValue = value.toString().slice(0, 40) + (value.toString().length > 40 ? "..." : "");
              } else if (stepConfig.options) {
                const values = Array.isArray(value) ? value : [value];
                displayValue = values.map(v => {
                  const opt = stepConfig.options?.find(o => o.id === v);
                  return opt ? `${opt.emoji} ${opt.label}` : v;
                }).join(", ");
              }
              
              return (
                <div key={stepId} className="flex justify-between text-[11px] sm:text-sm gap-2">
                  <span className="text-muted-foreground shrink-0">{stepConfig.title}:</span>
                  <span className="text-right truncate">{displayValue}</span>
                </div>
              );
            })}
          </div>
        </details>
      </motion.div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    switch (step.type) {
      case "single":
        return (
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
            {step.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSingleSelect(option.id)}
                className={cn(
                  "p-3 sm:p-4 rounded-lg sm:rounded-xl border text-left transition-all",
                  answers[step.id] === option.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">{option.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm">{option.label}</p>
                    {option.description && (
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-2">{option.description}</p>
                    )}
                  </div>
                  {answers[step.id] === option.id && (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case "multi":
        const selected = (answers[step.id] as string[]) || [];
        return (
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
            {step.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleMultiSelect(option.id)}
                className={cn(
                  "p-3 sm:p-4 rounded-lg sm:rounded-xl border text-left transition-all",
                  selected.includes(option.id)
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">{option.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm">{option.label}</p>
                    {option.priceModifier && (
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                        +{option.priceModifier}%
                      </p>
                    )}
                  </div>
                  {selected.includes(option.id) && (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case "text":
        return (
          <Input
            value={(answers[step.id] as string) || ""}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={step.placeholder}
            className="text-lg h-14"
            autoFocus
          />
        );

      case "textarea":
        return (
          <Textarea
            value={(answers[step.id] as string) || ""}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={step.placeholder}
            className="min-h-[150px] text-base resize-none"
            autoFocus
          />
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute inset-x-2 top-2 bottom-2 sm:inset-x-4 sm:top-4 sm:bottom-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-lg md:w-full bg-background rounded-xl sm:rounded-2xl border shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-3 sm:p-4 border-b shrink-0">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {productTitle}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Progress */}
            {!showSummary && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Шаг {currentStep + 1} из {steps.length}
                  </span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {showSummary ? (
                renderSummary()
              ) : (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="text-center space-y-1 sm:space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold">{step.title}</h2>
                    <p className="text-muted-foreground">{step.subtitle}</p>
                  </div>
                  
                  {renderStepContent()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t shrink-0">
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleBack}
                disabled={currentStep === 0 && !showSummary}
                className={cn(
                  "flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-colors text-sm sm:text-base",
                  currentStep === 0 && !showSummary
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-muted"
                )}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Назад</span>
              </button>

              {!showSummary && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base",
                    canProceed
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <span>{isLastStep ? "Готово" : "Далее"}</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
