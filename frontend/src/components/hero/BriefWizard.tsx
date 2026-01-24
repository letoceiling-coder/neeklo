import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Send, Loader2, Sparkles, X, FileText, Link2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, EmojiRadio } from "@/components/ui/emoji-radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Removed unused imports - no longer sending to backend
import { toast } from "@/hooks/use-toast";

// Attachment type definition
export interface Attachment {
  type: 'file' | 'link';
  name: string;
  url?: string;
  file?: File;
}

interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  type: "emoji" | "text" | "textarea" | "budget";
  options?: { emoji: string; label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: "project_type",
    title: "Что создаём?",
    subtitle: "Выберите тип проекта",
    type: "emoji",
    options: [
      { emoji: "🌐", label: "Сайт", value: "website" },
      { emoji: "🤖", label: "Бот", value: "bot" },
      { emoji: "📱", label: "Приложение", value: "app" },
      { emoji: "🎬", label: "Видео", value: "video" },
      { emoji: "⚡", label: "Автоматизация", value: "automation" },
      { emoji: "🎨", label: "Брендинг", value: "branding" },
    ],
    required: true,
  },
  {
    id: "urgency",
    title: "Как срочно?",
    subtitle: "Ваши сроки",
    type: "emoji",
    options: [
      { emoji: "🚀", label: "ASAP", value: "asap" },
      { emoji: "📅", label: "Месяц", value: "month" },
      { emoji: "🗓️", label: "Квартал", value: "quarter" },
      { emoji: "🌙", label: "Не спешим", value: "flexible" },
    ],
    required: true,
  },
  {
    id: "budget",
    title: "Бюджет проекта",
    subtitle: "Примерные рамки",
    type: "emoji",
    options: [
      { emoji: "💵", label: "до $5K", value: "small" },
      { emoji: "💰", label: "$5-15K", value: "medium" },
      { emoji: "💎", label: "$15-50K", value: "large" },
      { emoji: "🏆", label: "$50K+", value: "enterprise" },
    ],
    required: true,
  },
];

interface BriefWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialInput?: string;
  attachments?: Attachment[];
}

export function BriefWizard({ isOpen, onClose, initialInput = "", attachments = [] }: BriefWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    description: initialInput,
  });
  const [isSending, setIsSending] = useState(false);

  // Закрытие по ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Блокировка скролла страницы при открытой модалке
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const step = WIZARD_STEPS[currentStep];
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;
  const isLastStep = currentStep === WIZARD_STEPS.length - 1;
  const canProceed = !step.required || (answers[step.id] && answers[step.id].trim().length > 0);

  const handleAnswer = useCallback((value: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }));
    
    // Auto-advance for emoji selections
    if (step.type === "emoji" && currentStep < WIZARD_STEPS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    }
  }, [step.id, step.type, currentStep]);

  const handleNext = () => {
    if (canProceed && currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // File upload removed - redirecting directly to Telegram

  const handleSubmit = async () => {
    if (!canProceed) return;
    
    setIsSending(true);
    
    try {
      // Get labels for selected options
      const projectTypeLabel = WIZARD_STEPS[0].options?.find(o => o.value === answers.project_type)?.label || answers.project_type;
      const urgencyLabel = WIZARD_STEPS[1].options?.find(o => o.value === answers.urgency)?.label || answers.urgency;
      const budgetLabel = WIZARD_STEPS[2].options?.find(o => o.value === answers.budget)?.label || answers.budget;

      // Format message for Telegram
      const message = `📋 Бриф проекта\n\nТип: ${projectTypeLabel}\nСрочность: ${urgencyLabel}\nБюджет: ${budgetLabel}`;
      
      // Encode message for Telegram URL
      const encodedMessage = encodeURIComponent(message);
      
      // Close pop-up immediately
      onClose();
      
      // Redirect to Telegram with pre-filled message
      window.open(`https://t.me/neeekn?text=${encodedMessage}`, '_blank');
      
    } catch (error) {
      console.error('Error:', error);
      // Even on error, redirect to Telegram
      onClose();
      window.open('https://t.me/neeekn', '_blank');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && step.type === "text") {
      e.preventDefault();
      if (isLastStep) {
        handleSubmit();
      } else {
        handleNext();
      }
    }
  };

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="brief-wizard-title"
        >
          {/* Fullscreen overlay — полупрозрачный фон + размытие */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Контейнер модалки: max 800px, по центру, fade + slide up */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[800px] max-h-[95vh] sm:max-h-[90vh]
                       flex flex-col bg-background border border-white/10
                       rounded-[24px] shadow-2xl shadow-black/50 overflow-hidden
                       p-6 md:p-8"
            style={{ height: 'auto', minHeight: 'min(500px, 80vh)' }}
          >
            {/* Крестик в правом верхнем углу */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-xl text-muted-foreground
                         hover:bg-muted hover:text-foreground transition-colors
                         min-w-[44px] min-h-[44px] flex items-center justify-center
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header — pr под крестик */}
            <div className="pr-12 pb-3 md:pb-4 border-b border-border/50">
              <h2 id="brief-wizard-title" className="text-lg sm:text-xl font-bold text-foreground">
                Заполните бриф
              </h2>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-muted">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Step indicator */}
            <div className="flex justify-center gap-2 pt-4 pb-2">
              {WIZARD_STEPS.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    idx === currentStep
                      ? "bg-primary"
                      : idx < currentStep
                        ? "bg-primary/50"
                        : "bg-muted"
                  )}
                  animate={{ scale: idx === currentStep ? 1.2 : 1 }}
                />
              ))}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 sm:pb-6 pt-4
                          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/50
                          hover:scrollbar-thumb-border">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Title */}
                  <div className="text-center space-y-1 mb-6">
                    <motion.h2 
                      className="text-xl sm:text-2xl font-bold text-foreground"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {step.title}
                    </motion.h2>
                    <motion.p 
                      className="text-sm sm:text-base text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {step.subtitle}
                    </motion.p>
                  </div>

                  {/* Input based on type */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    {step.type === "emoji" && step.options && (
                      <RadioGroup
                        value={answers[step.id] || ""}
                        onValueChange={handleAnswer}
                        className="flex flex-wrap justify-center gap-3 sm:gap-4"
                      >
                        {step.options.map((option) => (
                          <motion.div
                            key={option.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <EmojiRadio
                              value={option.value}
                              emoji={option.emoji}
                              label={option.label}
                              className="w-20 h-20 sm:w-24 sm:h-24 min-w-[80px] min-h-[80px] sm:min-w-[96px] sm:min-h-[96px]"
                            />
                          </motion.div>
                        ))}
                      </RadioGroup>
                    )}

                    {step.type === "text" && (
                      <div className="relative">
                        <Input
                          value={answers[step.id] || ""}
                          onChange={(e) => handleAnswer(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={step.placeholder}
                          className="h-12 w-full text-center text-base sm:text-lg 
                                   bg-muted/50 border-border/50 focus:border-primary
                                   px-4 pr-4"
                          autoFocus
                        />
                      </div>
                    )}

                    {step.type === "textarea" && (
                      <div className="relative">
                        <Textarea
                          value={answers[step.id] || ""}
                          onChange={(e) => handleAnswer(e.target.value)}
                          placeholder={step.placeholder}
                          className="min-h-[120px] sm:min-h-[140px] w-full text-base 
                                   bg-muted/50 border-border/50 focus:border-primary 
                                   resize-none px-4 py-3"
                          autoFocus
                        />
                      </div>
                    )}
                  </motion.div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6 pb-2 
                                border-t border-border/30 mt-6">
                    <motion.button
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
                      whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        "min-h-[44px]",
                        currentStep === 0
                          ? "text-muted-foreground/50 cursor-not-allowed"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Назад</span>
                    </motion.button>

                    {isLastStep ? (
                      <motion.button
                        onClick={handleSubmit}
                        disabled={!canProceed || isSending}
                        whileHover={{ scale: canProceed && !isSending ? 1.02 : 1 }}
                        whileTap={{ scale: canProceed && !isSending ? 0.98 : 1 }}
                        className={cn(
                          "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all",
                          "min-h-[44px]",
                          canProceed && !isSending
                            ? "bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Отправляю...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Отправить</span>
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={handleNext}
                        disabled={!canProceed || step.type === "emoji"}
                        whileHover={{ scale: canProceed && step.type !== "emoji" ? 1.02 : 1 }}
                        whileTap={{ scale: canProceed && step.type !== "emoji" ? 0.98 : 1 }}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          "min-h-[44px]",
                          canProceed && step.type !== "emoji"
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        <span>Далее</span>
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="pb-2 border-t border-border/30 pt-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {attachments.map((attachment, index) => (
                    <div
                      key={`${attachment.type}-${index}`}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs",
                        attachment.type === 'file' 
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "bg-violet-500/10 text-violet-400"
                      )}
                    >
                      {attachment.type === 'file' ? (
                        attachment.name.match(/\.(jpg|jpeg|png)$/i) 
                          ? <ImageIcon className="w-3 h-3 flex-shrink-0" />
                          : <FileText className="w-3 h-3 flex-shrink-0" />
                      ) : (
                        <Link2 className="w-3 h-3 flex-shrink-0" />
                      )}
                      <span className="max-w-[100px] truncate">{attachment.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fun footer */}
            <div className="pb-4 sm:pb-6 border-t border-border/30 pt-3">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3 flex-shrink-0" />
                <span>Шаг {currentStep + 1} из {WIZARD_STEPS.length}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
