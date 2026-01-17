import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Check, Send, Loader2, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Confetti from "@/components/ui/confetti";

const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Имя должно содержать минимум 2 символа" })
    .max(100, { message: "Имя должно быть короче 100 символов" }),
  contact: z.string()
    .trim()
    .min(5, { message: "Укажите email или Telegram" })
    .max(255, { message: "Контакт должен быть короче 255 символов" }),
  service: z.string()
    .min(1, { message: "Выберите услугу" }),
  message: z.string()
    .trim()
    .max(1000, { message: "Сообщение должно быть короче 1000 символов" })
    .optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const benefits = [
  "Бесплатная консультация 30 минут",
  "Просчёт ROI и сроков",
  "Подбор оптимального решения",
  "Без обязательств",
];

const services = [
  { id: "ai-agent", name: "AI-агент", emoji: "🤖" },
  { id: "website", name: "Веб-сайт", emoji: "🌐" },
  { id: "telegram-bot", name: "Telegram-бот", emoji: "💬" },
  { id: "ai-video", name: "AI-видео", emoji: "🎬" },
  { id: "automation", name: "Автоматизация", emoji: "⚡" },
  { id: "ecosystem", name: "Digital-экосистема", emoji: "🔗" },
  { id: "consulting", name: "Консультация", emoji: "💡" },
];

export const CTAForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const shouldReduceMotion = usePrefersReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const handleServiceSelect = (serviceId: string, serviceName: string) => {
    setSelectedService(serviceId);
    setValue("service", serviceName, { shouldValidate: true });
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Заявка отправлена! ✓",
        description: "Мы свяжемся с вами в течение 24 часов",
      });
      
      setIsSuccess(true);
      setShowConfetti(true);
      reset();
      setSelectedService("");
      
      setTimeout(() => {
        setIsSuccess(false);
        setShowConfetti(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Confetti isActive={showConfetti} />
      <section id="contact" className="py-12 md:py-16 relative overflow-hidden bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
            className="lg:col-span-3 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Начните сейчас</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold mb-4">
              Готовы начать?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8">
              Получите бесплатный аудит за 24 часа
            </p>

            {/* Benefits List */}
            <div className="space-y-3 md:space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: shouldReduceMotion ? 0 : 0.4, 
                    delay: shouldReduceMotion ? 0 : index * 0.1 
                  }}
                  className="flex items-center gap-3 justify-center lg:justify-start"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Check size={14} className="text-primary" />
                  </div>
                  <span className="text-sm md:text-base text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Game Style Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 p-5 md:p-8 rounded-2xl shadow-xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Service Selection - Game Style Buttons */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Выберите услугу
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleServiceSelect(service.id, service.name)}
                        className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-left group active:scale-95 ${
                          selectedService === service.id
                            ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                            : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{service.emoji}</span>
                          <span className={`text-xs md:text-sm font-medium transition-colors ${
                            selectedService === service.id ? "text-primary" : "text-foreground"
                          }`}>
                            {service.name}
                          </span>
                        </div>
                        
                        {/* Checkmark */}
                        {selectedService === service.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" {...register("service")} />
                  {errors.service && (
                    <p className="mt-2 text-sm text-destructive">{errors.service.message}</p>
                  )}
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ваше имя
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Как вас зовут?"
                    className={`w-full h-12 md:h-14 px-4 bg-background/80 border-2 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-all ${
                      errors.name ? "border-destructive" : "border-border/50"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                {/* Contact Input */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Контакт
                  </label>
                  <input
                    {...register("contact")}
                    type="text"
                    placeholder="Email или @telegram"
                    className={`w-full h-12 md:h-14 px-4 bg-background/80 border-2 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-all ${
                      errors.contact ? "border-destructive" : "border-border/50"
                    }`}
                  />
                  {errors.contact && (
                    <p className="mt-2 text-sm text-destructive">{errors.contact.message}</p>
                  )}
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Сообщение <span className="text-muted-foreground">(опционально)</span>
                  </label>
                  <textarea
                    {...register("message")}
                    rows={3}
                    placeholder="Опишите вашу задачу..."
                    className="w-full px-4 py-3 bg-background/80 border-2 border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-all resize-none"
                  />
                </div>

                {/* Submit Button - Game Style */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full h-12 md:h-14 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSuccess
                      ? "bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                      : "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-[0_4px_20px_rgba(var(--primary-rgb),0.4)] hover:shadow-[0_4px_30px_rgba(var(--primary-rgb),0.6)] hover:scale-[1.02]"
                  } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Отправка...
                    </>
                  ) : isSuccess ? (
                    <>
                      <Check size={18} />
                      Заявка отправлена!
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Отправить заявку
                    </>
                  )}
                </motion.button>

                {/* Privacy Note */}
                <p className="text-xs text-muted-foreground text-center">
                  Нажимая кнопку, вы соглашаетесь с{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    политикой обработки данных
                  </a>
                </p>

                {/* Alternative CTA */}
                <div className="text-center pt-2">
                  <a
                    href="https://t.me/neeklo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Send size={14} />
                    Или напишите в Telegram
                  </a>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  );
};
