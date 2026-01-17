import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Сколько стоит AI-агент?",
    answer: "AI-агент стоит от 250,000₽ за разработку + 15,000₽/мес за поддержку. Цена зависит от сложности интеграций, количества каналов и функционала.",
  },
  {
    question: "Сколько занимает разработка сайта?",
    answer: "Простой сайт — 5 дней. Полноценное веб-приложение с интеграциями — 3-4 недели. MVP стартапа — 2-3 недели.",
  },
  {
    question: "Какая гарантия результата?",
    answer: "Мы даём гарантию: если система не заработает в первый месяц, вернём 50% стоимости. Плюс 1 месяц бесплатной поддержки.",
  },
  {
    question: "Можете интегрировать с 1C и CRM?",
    answer: "Да, мы интегрируем с 1C, Bitrix24, AmoCRM, Yandex.Kassa, Stripe и другими системами. Это входит в стандартную разработку.",
  },
  {
    question: "Работаете с удалёнными клиентами?",
    answer: "Да, 90% наших клиентов из разных городов России и СНГ. Работаем полностью удалённо через Telegram, Zoom и Notion.",
  },
  {
    question: "Сколько стоит Telegram-бот?",
    answer: "Простой бот от 80,000₽. WebApp-бот с интерфейсом от 200,000₽. Бот с gamification от 400,000₽.",
  },
  {
    question: "Что входит в AI-видео продакшн?",
    answer: "В пакет входит: генерация видео на AI, монтаж, color grading, субтитры, озвучка, музыка. На выходе — 10 готовых роликов за 3 недели.",
  },
  {
    question: "Можно начать с MVP и расширять?",
    answer: "Да, мы рекомендуем начинать с MVP за 300-500K, тестировать, а затем масштабировать. Так снижается риск и быстрее выход на рынок.",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        style={shouldReduceMotion ? {} : { y: y1 }}
        className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        style={shouldReduceMotion ? {} : { y: y2 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"
      />
      
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 sm:mb-14 md:mb-16 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent"
        >
          Часто задаваемые вопросы
        </motion.h2>

        {/* FAQ Items */}
        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: shouldReduceMotion ? 0 : 0.4, 
                delay: shouldReduceMotion ? 0 : index * 0.05 
              }}
              className="border-b border-border"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full py-4 sm:py-6 flex items-center justify-between gap-3 sm:gap-4 text-left group transition-colors duration-300 hover:text-primary"
              >
                <span className="text-sm sm:text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown 
                    size={20} 
                    className="text-muted-foreground group-hover:text-primary transition-colors duration-300" 
                  />
                </motion.div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ 
                      duration: shouldReduceMotion ? 0 : 0.4, 
                      ease: "easeOut" 
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4 sm:pb-6 pr-8 sm:pr-12">
                      <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
