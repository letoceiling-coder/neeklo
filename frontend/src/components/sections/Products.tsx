import { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Globe, Brain, Video, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnimationVariants } from "@/hooks/useScrollAnimation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  icon: any;
  description: string;
  price: string;
  timeline: string;
  slug: string;
  gradient: string;
  glowColor: string;
}

// 3 основных продукта для главной страницы (SEO Яндекс)
const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Создание веб сайта",
    icon: Globe,
    description: "Создаём сайты, лендинги и порталы с современной анимацией и высокой конверсией.",
    price: "от 45 000₽",
    timeline: "5 дней",
    slug: "website",
    gradient: "from-cyan-500 via-blue-500 to-blue-600",
    glowColor: "cyan",
  },
  {
    id: 2,
    name: "AI Агенты и Чат-боты",
    icon: Brain,
    description: "Умные ассистенты для поддержки клиентов и автоматизации продаж 24/7.",
    price: "от 65 000₽",
    timeline: "10 дней",
    slug: "ai-agent",
    gradient: "from-purple-500 via-violet-500 to-purple-700",
    glowColor: "purple",
  },
  {
    id: 3,
    name: "Видео Нейросети",
    icon: Video,
    description: "AI-генерация видео, цифровые аватары и нейромонтаж без съёмочной группы.",
    price: "от 5 000₽",
    timeline: "3 дня",
    slug: "ai-video",
    gradient: "from-pink-500 via-rose-500 to-purple-600",
    glowColor: "pink",
  },
];

export const Products = memo(function Products() {
  const { variants } = useAnimationVariants();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={prefersReducedMotion ? {} : { y: y1 }}
          className="absolute top-10 -left-32 w-96 h-96 bg-gradient-to-r from-cyan-500/15 to-blue-500/10 rounded-full blur-[120px]"
        />
        <motion.div 
          style={prefersReducedMotion ? {} : { y: y2 }}
          className="absolute bottom-10 -right-32 w-[500px] h-[500px] bg-gradient-to-l from-purple-500/15 to-pink-500/10 rounded-full blur-[120px]"
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={variants.fadeInUp}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Популярные решения</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight">
            Наши продукты
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Три главных направления для быстрого роста вашего бизнеса
          </p>
        </motion.div>

        {/* Products Grid - Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {featuredProducts.map((product, index) => {
            const Icon = product.icon;
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <Link 
                  to={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="block h-full group"
                >
                  <motion.div
                    whileHover={prefersReducedMotion ? {} : { 
                      y: -12,
                      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative h-full"
                  >
                    {/* Glow effect on hover */}
                    <div className={cn(
                      "absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500",
                      product.glowColor === "cyan" && "bg-gradient-to-r from-cyan-500/30 to-blue-500/30",
                      product.glowColor === "purple" && "bg-gradient-to-r from-purple-500/30 to-violet-500/30",
                      product.glowColor === "pink" && "bg-gradient-to-r from-pink-500/30 to-purple-500/30",
                    )} />
                    
                    {/* Card */}
                    <div className={cn(
                      "relative h-full rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-500",
                      "bg-gradient-to-br",
                      product.gradient,
                      "shadow-lg hover:shadow-2xl",
                      "flex flex-col overflow-hidden"
                    )}>
                      {/* Background decorations */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Floating orbs */}
                      <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      <div className="absolute bottom-4 left-4 w-16 h-16 bg-black/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      
                      {/* Icon */}
                      <div className="mb-5 relative z-10">
                        <motion.div 
                          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300"
                          whileHover={prefersReducedMotion ? {} : { rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                        </motion.div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 relative z-10">
                        {product.name}
                      </h3>
                      <p className="text-sm md:text-base text-white/85 leading-relaxed mb-6 relative z-10 flex-grow">
                        {product.description}
                      </p>

                      {/* Pricing & Timeline */}
                      <div className="flex items-center justify-between gap-3 mb-5 relative z-10">
                        <div className="text-xl md:text-2xl font-bold text-white">
                          {product.price}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-sm text-white/90">
                          <Clock className="w-4 h-4" />
                          {product.timeline}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.div 
                        className="w-full py-3.5 md:py-4 rounded-xl font-semibold text-sm md:text-base bg-white/20 backdrop-blur-sm text-white transition-all duration-300 flex items-center justify-center gap-2 border border-white/30 relative z-10 group-hover:bg-white/35"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Заказать</span>
                        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View all products link */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium group"
          >
            <span>Смотреть все 12 продуктов</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});