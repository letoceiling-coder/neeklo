"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Send, Loader2, Sparkles, X, FileText, Link2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, EmojiRadio } from "@/components/ui/emoji-radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadFiles, sendTelegramMessage } from "@/lib/api";
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
  {
    id: "description",
    title: "Опишите идею",
    subtitle: "Расскажите подробнее о проекте",
    type: "textarea",
    placeholder: "Например: Нужен сайт-портфолио для фотографа с галереей работ и формой заказа съёмки...",
    required: true,
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

  // Upload files to Laravel backend
  const handleFileUpload = async (): Promise<{ name: string; url: string }[]> => {
    const fileAttachments = attachments.filter(a => a.type === 'file' && a.file);
    
    if (fileAttachments.length === 0) return [];
    
    const files = fileAttachments.map(a => a.file!).filter(Boolean);
    const submissionId = `wizard-${Date.now()}`;
    
    const result = await uploadFiles(files, submissionId);
    
    if (!result.success) {
      console.error('File upload error:', result.message);
      return [];
    }
    
    return (result.files || []).map((file, index) => ({
      name: fileAttachments[index]?.name || file.name,
      url: file.url,
    }));
  };

  const handleSubmit = async () => {
    if (!canProceed) return;
    
    setIsSending(true);
    try {
      // Upload files first
      const uploadedFiles = await handleFileUpload();
      
      // Get link attachments
      const linkAttachments = attachments
        .filter(a => a.type === 'link' && a.url)
        .map(a => ({ name: a.name, url: a.url! }));
      
      // Format the brief data
      const projectTypeLabel = WIZARD_STEPS[0].options?.find(o => o.value === answers.project_type)?.label || answers.project_type;
      const urgencyLabel = WIZARD_STEPS[1].options?.find(o => o.value === answers.urgency)?.label || answers.urgency;
      const budgetLabel = WIZARD_STEPS[2].options?.find(o => o.value === answers.budget)?.label || answers.budget;

      // Format attachments for message
      const allAttachments = [...uploadedFiles, ...linkAttachments];
      const attachmentsText = allAttachments.length > 0 
        ? `\n\n📎 Прикреплённые материалы:\n${allAttachments.map(a => `• ${a.name}: ${a.url}`).join('\n')}`
        : '';

      const description = `📋 Бриф проекта\n\nТип: ${projectTypeLabel}\nСрочность: ${urgencyLabel}\nБюджет: ${budgetLabel}\n\n${answers.description}${attachmentsText}\n\n📞 Контакт: ${answers.contact}`;

      const result = await sendTelegramMessage({
        name: 'Клиент',
        phone: answers.contact,
        role: 'Бриф проекта (Wizard)',
        description,
      });

      if (!result.success) throw new Error(result.message || 'Ошибка отправки');

      toast({
        title: "🎉 Заявка отправлена!",
        description: "Менеджер свяжется с вами в ближайшее время",
      });

      setTimeout(() => {
        window.open('https://t.me/neeklo_bot', '_blank');
      }, 1500);

      onClose();
    } catch (error) {
      console.error('Send error:', error);
      toast({
        title: "Ошибка отправки",
        description: "Попробуйте позже или напишите нам напрямую в Telegram",
        variant: "destructive",
      });
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full md:max-w-md h-[95vh] md:h-auto md:max-h-[90vh] overflow-y-auto bg-card border-t md:border border-border/50 rounded-t-3xl md:rounded-2xl shadow-2xl touch-pan-x"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Drag handle for mobile */}
            <div className="flex justify-center pt-2 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
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
            <div className="flex justify-center gap-2 pt-6 pb-2">
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

            {/* Content */}
            <div className="px-6 pb-6 pt-4">
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
                  <div className="text-center space-y-1">
                    <motion.h2 
                      className="text-2xl font-bold text-foreground"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {step.title}
                    </motion.h2>
                    <motion.p 
                      className="text-sm text-muted-foreground"
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
                        className="flex flex-wrap justify-center gap-3"
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
                              className="w-16 h-16 sm:w-18 sm:h-18"
                            />
                          </motion.div>
                        ))}
                      </RadioGroup>
                    )}

                    {step.type === "text" && (
                      <Input
                        value={answers[step.id] || ""}
                        onChange={(e) => handleAnswer(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={step.placeholder}
                        className="h-12 text-center text-lg bg-muted/50 border-border/50 focus:border-primary"
                        autoFocus
                      />
                    )}

                    {step.type === "textarea" && (
                      <Textarea
                        value={answers[step.id] || ""}
                        onChange={(e) => handleAnswer(e.target.value)}
                        placeholder={step.placeholder}
                        className="min-h-[120px] text-base bg-muted/50 border-border/50 focus:border-primary resize-none"
                        autoFocus
                      />
                    )}
                  </motion.div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-4">
                    <motion.button
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        currentStep === 0
                          ? "text-muted-foreground/50 cursor-not-allowed"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Назад
                    </motion.button>

                    {isLastStep ? (
                      <motion.button
                        onClick={handleSubmit}
                        disabled={!canProceed || isSending}
                        whileHover={{ scale: canProceed ? 1.05 : 1 }}
                        whileTap={{ scale: canProceed ? 0.95 : 1 }}
                        className={cn(
                          "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all",
                          canProceed
                            ? "bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Отправляю...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Отправить
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={handleNext}
                        disabled={!canProceed || step.type === "emoji"}
                        whileHover={{ scale: canProceed && step.type !== "emoji" ? 1.05 : 1 }}
                        whileTap={{ scale: canProceed && step.type !== "emoji" ? 0.95 : 1 }}
                        className={cn(
                          "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          canProceed && step.type !== "emoji"
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        Далее
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="px-6 pb-2">
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
                          ? <ImageIcon className="w-3 h-3" />
                          : <FileText className="w-3 h-3" />
                      ) : (
                        <Link2 className="w-3 h-3" />
                      )}
                      <span className="max-w-[100px] truncate">{attachment.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fun footer */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3" />
                <span>Шаг {currentStep + 1} из {WIZARD_STEPS.length}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
