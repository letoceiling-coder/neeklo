import { motion, useScroll, useTransform } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { TaskAIWizard } from "@/components/sections/TaskAIWizard";
import { Button } from "@/components/common/Button";
import { useMetaTags } from "@/hooks/useMetaTags";
import { ArrowRight, Send, Globe, ShoppingCart, Bot, Smartphone, Database, Sparkles, Cpu, Clapperboard, Palette, Layers, Presentation, Video, FileText, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import servicesData from "@/data/services.json";

const iconMap: Record<string, any> = {
  globe: Globe,
  "shopping-cart": ShoppingCart,
  bot: Bot,
  smartphone: Smartphone,
  database: Database,
  sparkles: Sparkles,
  cpu: Cpu,
  clapperboard: Clapperboard,
  palette: Palette,
  layers: Layers,
  presentation: Presentation,
  video: Video,
  "file-text": FileText,
};

// Основные категории услуг для отображения
const serviceCategories = [
  {
    id: "development",
    title: "Разработка",
    description: "Сайты, приложения, боты и интеграции",
    gradient: "from-blue-500 to-cyan-500",
    services: [
      { id: "web-sites", title: "Веб-сайты", icon: Globe, price: "от 80 000 ₽", time: "от 5 дней" },
      { id: "ecommerce", title: "Интернет-магазины", icon: ShoppingCart, price: "от 150 000 ₽", time: "от 2 недель" },
      { id: "telegram-bots", title: "Telegram-боты", icon: Bot, price: "от 30 000 ₽", time: "от 3 дней" },
      { id: "telegram-mini-apps", title: "Mini Apps", icon: Smartphone, price: "от 100 000 ₽", time: "от 2 недель" },
      { id: "crm", title: "CRM-системы", icon: Database, price: "от 50 000 ₽", time: "от 1 недели" },
      { id: "mobile-apps", title: "Мобильные приложения", icon: Smartphone, price: "от 300 000 ₽", time: "от 1 месяца" },
    ],
  },
  {
    id: "ai",
    title: "AI и нейросети",
    description: "Автоматизация, видео, фото и агенты",
    gradient: "from-purple-500 to-pink-500",
    services: [
      { id: "ai-agent", title: "AI-агенты", icon: Sparkles, price: "от 150 000 ₽", time: "от 2 недель" },
      { id: "ai-integration", title: "AI-интеграции", icon: Cpu, price: "от 100 000 ₽", time: "от 2 недель" },
      { id: "ai-video", title: "AI-видео", icon: Clapperboard, price: "от 30 000 ₽", time: "от 3 дней" },
    ],
  },
  {
    id: "design",
    title: "Дизайн",
    description: "Брендинг, UI/UX и презентации",
    gradient: "from-orange-500 to-red-500",
    services: [
      { id: "branding", title: "Брендинг", icon: Palette, price: "от 60 000 ₽", time: "от 1 недели" },
      { id: "ui-ux", title: "UI/UX дизайн", icon: Layers, price: "от 50 000 ₽", time: "от 5 дней" },
      { id: "presentations", title: "Презентации", icon: Presentation, price: "от 25 000 ₽", time: "от 3 дней" },
      { id: "video-production", title: "Видео", icon: Video, price: "от 15 000 ₽", time: "от 2 дней" },
      { id: "content", title: "Контент", icon: FileText, price: "от 20 000 ₽", time: "от 3 дней" },
    ],
  },
];

const benefits = [
  "Фиксированные цены",
  "Прозрачные сроки",
  "Поддержка 24/7",
  "Гарантия результата",
];

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    icon: any;
    price: string;
    time: string;
  };
  index: number;
  categoryGradient: string;
}

const ServiceCard = ({ service, index, categoryGradient }: ServiceCardProps) => {
  const Icon = service.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/services/${service.id}`}>
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group relative p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 h-full"
        >
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          
          {/* Meta */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary font-medium">{service.price}</span>
            <span className="text-muted-foreground">{service.time}</span>
          </div>

          {/* Arrow */}
          <ArrowRight className="absolute top-5 right-5 w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </motion.div>
      </Link>
    </motion.div>
  );
};

const Services = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useMetaTags(
    "Услуги | Neeklo Studio",
    "Веб-разработка, AI-интеграции, брендинг и дизайн. Полный цикл создания цифровых продуктов для бизнеса.",
    "https://neeklo.ru/og-services.jpg",
    "https://neeklo.ru/services",
    "веб-разработка, AI интеграции, брендинг, Telegram боты, мобильные приложения, CRM"
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 md:pt-24 pb-0">
        {/* Hero Section */}
        <motion.section 
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="py-12 md:py-20 relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center relative z-10"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                Полный цикл разработки
              </motion.span>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                Наши{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  услуги
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                От идеи до запуска — создаём цифровые продукты, которые решают бизнес-задачи
              </p>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-3 md:gap-6"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Container>
        </motion.section>

        {/* Services by Category */}
        {serviceCategories.map((category, categoryIndex) => (
          <section key={category.id} className="py-12 md:py-20">
            <Container>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${category.gradient}`} />
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {category.title}
                  </h2>
                </div>
                <p className="text-muted-foreground ml-6">
                  {category.description}
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
                {category.services.map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={index}
                    categoryGradient={category.gradient}
                  />
                ))}
              </div>
            </Container>
          </section>
        ))}

        {/* AI Wizard Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-card/50 to-background">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-10"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-помощник</span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Не знаете, какую услугу выбрать?
              </h2>
              <p className="text-lg text-muted-foreground">
                AI-конструктор задач проанализирует ваш запрос и подберёт оптимальное решение
              </p>
            </motion.div>

            <TaskAIWizard />
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" />
          
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative max-w-3xl mx-auto text-center"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 blur-3xl bg-primary/10 rounded-full scale-150 -z-10" />

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Готовы начать
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  свой проект?
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
                Расскажите о вашей задаче — мы подготовим индивидуальное предложение
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact">
                  <Button 
                    size="lg" 
                    variant="primary" 
                    className="group w-full sm:w-auto px-8 h-14"
                  >
                    Обсудить проект
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a 
                  href="https://t.me/neeklo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button size="lg" variant="outline" className="w-full group h-14 px-8">
                    <Send className="mr-2 w-5 h-5" />
                    Telegram
                  </Button>
                </a>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
