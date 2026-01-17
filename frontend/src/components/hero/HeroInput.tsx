"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Mic, MicOff, ArrowRight, 
  Target, Rocket, Zap, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { BriefWizard, Attachment } from "./BriefWizard";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

const QUICK_PROMPTS = [
  { 
    label: "Привлечь клиентов", 
    value: "Хочу привлечь больше клиентов в бизнес через интернет",
    icon: Target 
  },
  { 
    label: "Запустить продажи", 
    value: "Нужно запустить продажи через интернет с нуля",
    icon: Rocket 
  },
  { 
    label: "Автоматизация", 
    value: "Хочу автоматизировать коммуникацию с клиентами",
    icon: Zap 
  },
  { 
    label: "Telegram-бот", 
    value: "Нужна система продаж через Telegram с ботом",
    icon: MessageSquare 
  },
];

export function HeroInput() {
  const [value, setValue] = useState("");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [attachments] = useState<Attachment[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 48,
    maxHeight: 100,
  });

  const { isListening, isSupported, toggleListening } = useSpeechRecognition({
    lang: 'ru-RU',
    onResult: (transcript, isFinal) => {
      if (transcript) {
        setValue(prev => {
          if (isFinal) {
            return prev + (prev ? ' ' : '') + transcript;
          }
          return prev;
        });
        setTimeout(() => adjustHeight(), 0);
      }
    },
    onError: (error) => {
      toast({
        title: "Голосовой ввод",
        description: error,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isListening) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          audioContextRef.current = new AudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          analyserRef.current.fftSize = 32;

          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          
          const updateLevel = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
              setAudioLevel(Math.min(avg / 128, 1));
            }
            animationRef.current = requestAnimationFrame(updateLevel);
          };
          updateLevel();
        })
        .catch(() => {});
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setAudioLevel(0);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening]);

  const handleOpenWizard = useCallback(() => {
    setIsWizardOpen(true);
  }, []);

  const handlePromptClick = useCallback((promptValue: string) => {
    setValue(promptValue);
    setTimeout(() => adjustHeight(), 0);
    setTimeout(() => setIsWizardOpen(true), 300);
  }, [adjustHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleOpenWizard();
    }
    if (e.key === "Enter" && !e.shiftKey && value.trim()) {
      e.preventDefault();
      handleOpenWizard();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };

  return (
    <>
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 space-y-5">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            AI-конструктор решений
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-center"
        >
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
            Digital-системы
            <br />
            <span className="text-gradient-cyan-purple">
              для роста бизнеса
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm sm:text-base text-muted-foreground text-center max-w-md"
        >
          Опишите задачу и получите решение за 7-14 дней
        </motion.p>

        {/* AI Input Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="w-full relative"
        >
          {/* Background Glow */}
          <motion.div 
            className="absolute -inset-3 pointer-events-none"
            animate={{ opacity: isFocused ? 0.7 : 0.3 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 blur-xl" />
          </motion.div>

          {/* Main Input Card */}
          <div
            className={cn(
              "relative rounded-xl overflow-hidden transition-all duration-300",
              "bg-surface border",
              isFocused 
                ? "border-primary/40 shadow-glow-primary" 
                : "border-border",
              isListening && "border-error/50"
            )}
          >
            {/* Audio Level Indicator */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-0 left-0 right-0 h-0.5 bg-error/20 overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-error"
                    style={{ width: `${Math.max(15, audioLevel * 100)}%` }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-3">
                {/* AI Icon */}
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={isListening ? "Слушаю..." : "Опишите вашу задачу..."}
                  rows={1}
                  className={cn(
                    "flex-1 bg-transparent border-none resize-none",
                    "text-foreground text-sm sm:text-base",
                    "placeholder:text-muted-foreground/50",
                    "focus:outline-none focus:ring-0",
                    "min-h-[40px] py-2"
                  )}
                />

                {/* Voice Button */}
                {isSupported && (
                  <motion.button
                    type="button"
                    onClick={toggleListening}
                    whileTap={{ scale: 0.92 }}
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                      isListening
                        ? "bg-error/20 text-error"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    )}
                    aria-label={isListening ? "Остановить" : "Голосовой ввод"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </motion.button>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenWizard}
                  className={cn(
                    "h-9 px-4 rounded-lg flex items-center justify-center gap-2 flex-shrink-0",
                    "gradient-cyan-purple text-primary-foreground font-medium text-sm",
                    "shadow-glow-primary hover:shadow-glow-accent transition-shadow"
                  )}
                >
                  <span className="hidden sm:inline">Создать</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="w-full"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_PROMPTS.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <motion.button
                  key={prompt.label}
                  onClick={() => handlePromptClick(prompt.value)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.04 }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
                    "text-xs font-medium",
                    "bg-surface hover:bg-surface-elevated",
                    "border border-border hover:border-primary/30",
                    "text-muted-foreground hover:text-foreground",
                    "transition-all duration-200"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 text-primary/60" />
                  <span>{prompt.label}</span>
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
