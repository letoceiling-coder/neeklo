import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useMetaTags } from "@/hooks/useMetaTags";
import { BriefWizard } from "@/components/hero/BriefWizard";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  { id: "website", title: "Сайт для бизнеса", description: "Лендинги, корпоративные сайты и интернет-магазины.", price: "от 45 000 ₽" },
  { id: "telegram-bot", title: "Telegram-бот", description: "Автоматизация общения, заявок и продаж в Telegram.", price: "от 35 000 ₽" },
  { id: "mini-app", title: "Mini App", description: "Каталоги, заказы и личные кабинеты внутри Telegram.", price: "от 80 000 ₽" },
  { id: "mobile-app", title: "Мобильное приложение", description: "Нативные iOS и Android приложения для бизнеса.", price: "от 300 000 ₽" },
  { id: "ai-agent", title: "AI-ассистент", description: "Чат-боты и голосовые ассистенты на базе нейросетей.", price: "от 65 000 ₽" },
  { id: "ai-video", title: "AI-видео", description: "Рекламные ролики, Reels и контент с нейросетями.", price: "от 25 000 ₽" },
  { id: "automation", title: "Автоматизация", description: "Интеграции, воронки и скрипты для экономии времени.", price: "от 40 000 ₽" },
  { id: "branding", title: "Брендинг", description: "Айдентика, логотипы и фирменный стиль.", price: "от 30 000 ₽" },
  { id: "crm", title: "CRM-интеграции", description: "Подключение и настройка CRM под ваши процессы.", price: "от 35 000 ₽" },
  { id: "ecosystem", title: "Digital-экосистема", description: "Комплекс: сайт, бот, CRM и аналитика.", price: "от 200 000 ₽" },
  { id: "support", title: "Техподдержка", description: "Абонентское сопровождение и поддержка сервисов.", price: "от 25 000 ₽/мес" },
  { id: "consulting", title: "Консалтинг", description: "Аудит, стратегия и пошаговые рекомендации.", price: "от 15 000 ₽" },
];

const Services = () => {
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  useMetaTags(
    "Услуги — Neeklo Studio | Сайты, боты, AI-видео",
    "Каталог услуг: разработка сайтов, Telegram-ботов, AI-ассистентов и AI-видео. Цены и сроки прозрачно.",
    "https://neeklo.ru/og-services.jpg",
    "https://neeklo.ru/services",
    "услуги студия, разработка сайтов, telegram бот, ai видео, ai ассистент"
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <section className="py-8 md:py-12">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto text-center mb-10"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                Услуги
              </h1>
              <p className="text-muted-foreground">
                Выберите услугу и узнайте стоимость
              </p>
            </motion.div>

            {/* Services Grid: Mobile 1, Tablet 2, Desktop 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service, index) => (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  className="h-full flex flex-col"
                >
                  <div
                    className={cn(
                      "group relative h-full flex flex-col",
                      "rounded-xl p-6 md:p-8",
                      "bg-background border border-border/50 shadow-md",
                      "card-hover"
                    )}
                  >
                    <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4 flex-1 line-clamp-2">
                      {service.description}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-foreground tracking-tight mb-6">
                      {service.price}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsBriefOpen(true)}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-lg",
                        "text-sm font-medium min-h-[40px]",
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                        "shadow-sm hover:shadow-md transition-all duration-200"
                      )}
                      aria-label={`Узнать стоимость: ${service.title}`}
                    >
                      Узнать стоимость
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />

      <BriefWizard isOpen={isBriefOpen} onClose={() => setIsBriefOpen(false)} />
    </div>
  );
};

export default Services;
