import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useMetaTags } from "@/hooks/useMetaTags";
import { StructuredData } from "@/components/common/StructuredData";
import { motion } from "framer-motion";
import { Mail, Send, MapPin, Phone, Check, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Confetti from "@/components/ui/confetti";
import { sendTelegramMessage } from "@/lib/api";

const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Минимум 2 символа" })
    .max(100, { message: "Максимум 100 символов" }),
  contact: z.string()
    .trim()
    .min(5, { message: "Укажите email или Telegram" })
    .max(255, { message: "Максимум 255 символов" }),
  service: z.string()
    .min(1, { message: "Выберите услугу" }),
  message: z.string()
    .trim()
    .max(1000, { message: "Максимум 1000 символов" })
    .optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const services = [
  { value: "ai-agent", label: "AI-ассистент", emoji: "🤖", names: ["AI Агенты и Чат-боты", "AI-ассистент"] },
  { value: "website", label: "Веб-сайт", emoji: "🌐", names: ["Создание веб сайта", "Веб-сайт"] },
  { value: "telegram-bot", label: "Telegram-бот", emoji: "📱", names: ["Telegram-бот"] },
  { value: "ai-video", label: "AI-видео", emoji: "🎬", names: ["Видео Нейросети", "AI-видео"] },
  { value: "automation", label: "Автоматизация", emoji: "⚡", names: ["Автоматизация"] },
  { value: "ecosystem", label: "Экосистема", emoji: "🔗", names: ["Экосистема"] },
  { value: "consulting", label: "Консультация", emoji: "💡", names: ["Консультация"] },
];

const contactInfo = [
  {
    icon: Send,
    label: "Telegram",
    value: "@neeklo",
    href: "https://t.me/neeklo",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Phone,
    label: "Телефон",
    value: "+7 (999) 123-45-67",
    href: "tel:+79991234567",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Mail,
    label: "Email",
    value: "klochkonikita@mail.ru",
    href: "mailto:klochkonikita@mail.ru",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: MapPin,
    label: "Адрес",
    value: "Москва, Россия",
    href: null,
    color: "from-orange-500 to-red-500",
  },
];

const Contact = () => {
  const [searchParams] = useSearchParams();
  
  useMetaTags(
    "Контакты — Neeklo Studio | Заказать сайт, бота, AI-решение в Москве",
    "Свяжитесь с Neeklo Studio для заказа веб-сайта, Telegram-бота, AI-ассистента или видео. Бесплатная консультация. Москва, Россия.",
    "https://neeklo.ru/og-contact.jpg",
    "https://neeklo.ru/contact",
    "контакты neeklo, заказать сайт москва, разработка сайтов, telegram бот заказать, ai ассистент, веб студия москва"
  );

  // Structured data for contact page (SEO)
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Контакты Neeklo Studio",
    "description": "Страница контактов digital-студии Neeklo. Закажите сайт, бота или AI-решение.",
    "url": "https://neeklo.ru/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Neeklo Studio",
      "telephone": "+7 (999) 123-45-67",
      "email": "klochkonikita@mail.ru",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Москва",
        "addressCountry": "RU"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+7 (999) 123-45-67",
        "email": "klochkonikita@mail.ru",
        "availableLanguage": ["Russian", "English"]
      }
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // Pre-fill service from URL parameter
  useEffect(() => {
    const productParam = searchParams.get("product");
    if (productParam) {
      const matchedService = services.find(s => 
        s.names?.some(name => name.toLowerCase() === productParam.toLowerCase()) ||
        s.label.toLowerCase() === productParam.toLowerCase()
      );
      if (matchedService) {
        setSelectedService(matchedService.value);
        setValue("service", matchedService.value);
      }
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const serviceName = services.find(s => s.value === data.service)?.label || data.service;
      
      const result = await sendTelegramMessage({
        name: data.name.trim().slice(0, 100),
        phone: data.contact.trim().slice(0, 100),
        description: `📋 Форма контактов\n\n🏷️ Услуга: ${serviceName}\n\n${data.message ? `💬 Сообщение: ${data.message.trim().slice(0, 500)}` : ""}`,
        role: "Контактная форма",
      });

      if (!result.success) throw new Error(result.message || 'Ошибка отправки');
      
      toast({
        title: "Заявка отправлена! ✓",
        description: "Мы свяжемся с вами в течение 24 часов",
      });
      
      setIsSuccess(true);
      setShowConfetti(true);
      reset();
      setSelectedService(null);
      
      setTimeout(() => {
        setIsSuccess(false);
        setShowConfetti(false);
      }, 3000);
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже или напишите в Telegram.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceSelect = (value: string) => {
    setSelectedService(value);
    setValue("service", value);
  };

  return (
    <>
      <StructuredData data={contactPageSchema} />
      <Confetti isActive={showConfetti} />
      <div className="min-h-screen bg-background">
      <main className="pt-24 md:pt-32 pb-16 md:pb-20">
        <Container>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Бесплатная консультация</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              Давайте{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                поговорим
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto px-4">
              Расскажите о проекте — ответим за 24 часа
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Form - 3 cols */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-3 order-2 lg:order-1"
              >
                <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-card border border-border">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Service Selection - Game Style */}
                    <div>
                      <label className="block text-sm font-medium mb-3 text-foreground">
                        Что вас интересует?
                      </label>
                      <input type="hidden" {...register("service")} />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {services.map((service) => (
                          <button
                            key={service.value}
                            type="button"
                            onClick={() => handleServiceSelect(service.value)}
                            className={`
                              relative p-3 rounded-xl text-left transition-all duration-200
                              border-2 hover:scale-[1.02] active:scale-[0.98]
                              ${selectedService === service.value
                                ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/20"
                                : "bg-background border-border hover:border-primary/50 text-foreground"
                              }
                            `}
                          >
                            <span className="text-lg mb-1 block">{service.emoji}</span>
                            <span className="text-xs font-medium leading-tight block">{service.label}</span>
                            {selectedService === service.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                              >
                                <Check className="w-2.5 h-2.5 text-primary-foreground" />
                              </motion.div>
                            )}
                          </button>
                        ))}
                      </div>
                      {errors.service && (
                        <p className="mt-2 text-xs text-destructive">{errors.service.message}</p>
                      )}
                    </div>

                    {/* Name & Contact */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          Ваше имя
                        </label>
                        <input
                          {...register("name")}
                          type="text"
                          placeholder="Иван"
                          className={`
                            w-full h-12 px-4 rounded-xl bg-background border text-foreground
                            placeholder:text-muted-foreground
                            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                            transition-all duration-200
                            ${errors.name ? "border-destructive" : "border-border"}
                          `}
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          Контакт
                        </label>
                        <input
                          {...register("contact")}
                          type="text"
                          placeholder="@telegram или email"
                          className={`
                            w-full h-12 px-4 rounded-xl bg-background border text-foreground
                            placeholder:text-muted-foreground
                            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                            transition-all duration-200
                            ${errors.contact ? "border-destructive" : "border-border"}
                          `}
                        />
                        {errors.contact && (
                          <p className="mt-1 text-xs text-destructive">{errors.contact.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        О проекте <span className="text-muted-foreground font-normal">(необязательно)</span>
                      </label>
                      <textarea
                        {...register("message")}
                        rows={3}
                        placeholder="Кратко опишите задачу..."
                        className="
                          w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground
                          placeholder:text-muted-foreground
                          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                          transition-all duration-200 resize-none
                        "
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className={`
                        w-full h-14 rounded-xl font-medium text-base
                        flex items-center justify-center gap-2
                        transition-all duration-300 
                        hover:scale-[1.02] active:scale-[0.98]
                        disabled:opacity-70 disabled:cursor-not-allowed
                        ${isSuccess
                          ? "bg-emerald-500 text-white"
                          : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
                        }
                      `}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Отправляем...
                        </>
                      ) : isSuccess ? (
                        <>
                          <Check className="w-5 h-5" />
                          Отправлено!
                        </>
                      ) : (
                        <>
                          Отправить заявку
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {/* Privacy + Telegram */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <p className="text-xs text-muted-foreground text-center sm:text-left">
                        Нажимая кнопку, вы соглашаетесь с{" "}
                        <a href="/privacy" className="text-primary hover:underline">
                          политикой конфиденциальности
                        </a>
                      </p>
                      <a
                        href="https://t.me/neeklo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline whitespace-nowrap"
                      >
                        <Send className="w-4 h-4" />
                        Telegram
                      </a>
                    </div>
                  </form>
                </div>
              </motion.div>

              {/* Contact Info - 2 cols */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2 order-1 lg:order-2 space-y-4"
              >
                {/* Contact Cards */}
                <div className="space-y-3">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    >
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="
                            flex items-center gap-4 p-4 rounded-xl
                            bg-card border border-border
                            hover:border-primary/50 hover:bg-card/80
                            transition-all duration-200 group
                          "
                        >
                          <div className={`
                            w-10 h-10 rounded-lg bg-gradient-to-br ${item.color}
                            flex items-center justify-center flex-shrink-0
                            group-hover:scale-110 transition-transform
                          `}>
                            <item.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="font-medium text-foreground truncate">{item.value}</p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                          <div className={`
                            w-10 h-10 rounded-lg bg-gradient-to-br ${item.color}
                            flex items-center justify-center flex-shrink-0
                          `}>
                            <item.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="font-medium text-foreground truncate">{item.value}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Social */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
                >
                  <h3 className="text-sm font-semibold mb-3">Социальные сети</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Instagram", url: "https://instagram.com/neeklo.studio" },
                      { name: "LinkedIn", url: "https://linkedin.com/company/neeklo-studio" },
                      { name: "Behance", url: "https://behance.net/neeklostudio" },
                    ].map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          px-3 py-1.5 rounded-full text-xs font-medium
                          bg-background border border-border
                          hover:border-primary/50 hover:text-primary
                          transition-all duration-200
                        "
                      >
                        {social.name}
                      </a>
                    ))}
                  </div>
                </motion.div>

                {/* Hours */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  className="p-5 rounded-xl bg-card border border-border"
                >
                  <h3 className="text-sm font-semibold mb-2">График работы</h3>
                  <p className="text-sm text-muted-foreground">Пн-Пт: 10:00 – 19:00</p>
                  <p className="text-xs text-muted-foreground mt-1">Заявки 24/7</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
    </>
  );
};

export default Contact;
