"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Edit3, Check, Loader2, Globe, Video, Bot, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BriefData {
  briefId: string;
  project_summary: string;
  technical_requirements: string;
  timeline_budget: string;
  deliverables: string;
  generatedAt: string;
}

interface BriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefData: BriefData | null;
  userInput: string;
  onBriefUpdate: (data: BriefData) => void;
}

interface BriefSectionProps {
  title: string;
  icon: string;
  content: string;
  isEditing: boolean;
  onEdit: (value: string) => void;
}

const productCategories = [
  {
    name: "Веб-сайты",
    icon: Globe,
    color: "#00d4ff",
    products: [
      { name: "Сайт за 5 дней", price: "$5K — $15K", features: ["5-20 страниц", "Интеграции", "SEO оптимизация"] }
    ]
  },
  {
    name: "AI-боты",
    icon: Bot,
    color: "#8b5cf6",
    products: [
      { name: "Telegram-бот", price: "$2.5K — $20K", features: ["WebApp UI", "Интеграции", "Gamification"] },
      { name: "AI-агент", price: "$5K — $50K", features: ["24/7 поддержка", "LLM-based", "Обучение на данных"] }
    ]
  },
  {
    name: "Видео",
    icon: Video,
    color: "#00ff88",
    products: [
      { name: "AI-видео продакшн", price: "$10K — $40K", features: ["Синтез видео", "Монтаж на AI", "Color grading"] }
    ]
  },
  {
    name: "Автоматизация",
    icon: Zap,
    color: "#ffa500",
    products: [
      { name: "Интеграция систем", price: "$3K — $30K", features: ["Workflow автоматизация", "1C, CRM, платежи"] }
    ]
  }
];

function BriefSection({ title, icon, content, isEditing, onEdit }: BriefSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[rgba(20,20,30,0.8)] border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-6"
    >
      <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
        <span className="text-lg sm:text-xl">{icon}</span>
        {title}
      </h3>
      {isEditing ? (
        <Textarea
          value={content}
          onChange={(e) => onEdit(e.target.value)}
          className="min-h-[100px] sm:min-h-[120px] bg-background/50 border-primary/20 text-foreground resize-none text-sm sm:text-[15px] leading-relaxed"
        />
      ) : (
        <p className="text-muted-foreground whitespace-pre-line text-sm sm:text-[15px] leading-[1.6] sm:leading-[1.7]">
          {content}
        </p>
      )}
    </motion.div>
  );
}

function ProductCard({ category }: { category: typeof productCategories[0] }) {
  const Icon = category.icon;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: `${category.color}66` }}
      whileTap={{ scale: 1.01 }}
      className="bg-[rgba(25,25,40,0.8)] border border-primary/10 sm:border-2 rounded-xl sm:rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] min-h-[100px] active:bg-[rgba(30,30,50,0.9)]"
    >
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <div 
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: category.color }} />
        </div>
        <h4 className="font-semibold text-foreground text-sm sm:text-base">{category.name}</h4>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        {category.products.map((product, idx) => (
          <div key={idx} className="border-t border-white/5 pt-2 sm:pt-3 first:border-0 first:pt-0">
            <div className="flex justify-between items-start mb-1 sm:mb-2 gap-2">
              <span className="text-xs sm:text-sm font-medium text-foreground">{product.name}</span>
              <span className="text-xs sm:text-sm font-medium flex-shrink-0" style={{ color: category.color }}>{product.price}</span>
            </div>
            <ul className="space-y-0.5 sm:space-y-1">
              {product.features.map((feature, fidx) => (
                <li key={fidx} className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function BriefModal({ isOpen, onClose, briefData, userInput, onBriefUpdate }: BriefModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [editedData, setEditedData] = useState<BriefData | null>(null);

  const currentData = editedData || briefData;

  const handleEdit = (field: keyof BriefData, value: string) => {
    if (!currentData) return;
    const updated = { ...currentData, [field]: value };
    setEditedData(updated);
    onBriefUpdate(updated);
  };

  const handleSendToTelegram = async () => {
    if (!currentData) return;
    
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-telegram', {
        body: { briefData: currentData, userInput }
      });

      if (error) throw error;

      toast({
        title: "Бриф отправлен!",
        description: "Менеджер свяжется с вами в ближайшее время.",
      });

      setTimeout(() => {
        window.open('https://t.me/neeklo_bot', '_blank');
      }, 1500);
      
      onClose();
    } catch (error) {
      console.error('Send error:', error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить бриф. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && currentData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="brief-modal-title"
        >
          {/* Full Overlay with blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[rgba(5,5,15,0.85)] backdrop-blur-xl" 
          />
          
          {/* Modal Container - ChatGPT style */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[900px] max-h-[95vh] sm:max-h-[95vh] h-[100dvh] sm:h-auto flex flex-col bg-[#0a0a0a] border-0 sm:border-2 border-primary/15 rounded-none sm:rounded-2xl md:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_60px_rgba(0,212,255,0.1)] overflow-hidden"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 bg-[rgba(10,10,10,0.95)] backdrop-blur-lg border-b border-white/8 px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex items-start justify-between z-10 rounded-t-2xl sm:rounded-t-3xl">
              <div className="flex-1 min-w-0">
                <h2 id="brief-modal-title" className="text-lg sm:text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                  <span>✨</span> <span className="truncate">Ваш краткий бриф</span>
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Сформировано AI на основе вашего описания
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-muted-foreground hover:text-primary min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0 ml-2"
                aria-label="Закрыть модальное окно"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 md:px-8 py-4 sm:py-6 pb-44 sm:pb-40 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-primary/30 hover:scrollbar-thumb-primary/60">
              {/* Brief Sections - ALL EXPANDED */}
              <div className="space-y-4">
                <BriefSection
                  title="Описание проекта"
                  icon="📋"
                  content={currentData.project_summary}
                  isEditing={isEditing}
                  onEdit={(v) => handleEdit('project_summary', v)}
                />
                <BriefSection
                  title="Технические требования"
                  icon="⚙️"
                  content={currentData.technical_requirements}
                  isEditing={isEditing}
                  onEdit={(v) => handleEdit('technical_requirements', v)}
                />
                <BriefSection
                  title="Таймлайн и бюджет"
                  icon="📅"
                  content={currentData.timeline_budget}
                  isEditing={isEditing}
                  onEdit={(v) => handleEdit('timeline_budget', v)}
                />
                <BriefSection
                  title="Ожидаемые результаты"
                  icon="🎯"
                  content={currentData.deliverables}
                  isEditing={isEditing}
                  onEdit={(v) => handleEdit('deliverables', v)}
                />
              </div>

              {/* Product Selection Section */}
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                    <span>🎯</span> Выберите подходящий продукт
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    На основе вашего описания рекомендуем следующие услуги
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  {productCategories.map((category, idx) => (
                    <ProductCard key={idx} category={category} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Footer with Actions */}
            <div className="sticky bottom-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent border-t border-primary/15 sm:border-t-2 px-4 sm:px-6 md:px-8 py-4 sm:py-5 space-y-2 sm:space-y-3 z-10 rounded-b-none sm:rounded-b-2xl md:rounded-b-3xl">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSendToTelegram}
                disabled={isSending}
                className={cn(
                  "w-full h-[52px] sm:h-14 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3",
                  "bg-gradient-to-r from-primary to-purple-500",
                  "hover:brightness-110 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "text-sm sm:text-base",
                  "min-h-[44px]"
                )}
                aria-label="Отправить бриф в Telegram"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="hidden sm:inline">Отправляю в Telegram...</span>
                    <span className="sm:hidden">Отправляю...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>✈️ Отправить в Telegram</span>
                  </>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "w-full h-11 sm:h-12 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2",
                  "bg-purple-500/15 border border-purple-500/30 sm:border-2 text-purple-400",
                  "hover:bg-purple-500/25 hover:border-purple-500/60",
                  "text-sm sm:text-base",
                  "min-h-[44px]"
                )}
                aria-label={isEditing ? "Сохранить изменения" : "Редактировать бриф"}
              >
                {isEditing ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>✓ Сохранить изменения</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-5 h-5" />
                    <span>✏️ Редактировать</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
