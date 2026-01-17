"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
  image?: string;
}

// Static articles data - ready for CMS/blog integration
const ARTICLES: NewsArticle[] = [
  {
    id: "1",
    title: "Как выбрать между лендингом и многостраничником",
    excerpt: "Разбираем, когда бизнесу нужен лендинг, а когда — полноценный сайт",
    date: "2025-01-15",
    category: "Сайты",
    slug: "landing-vs-multipage",
  },
  {
    id: "2",
    title: "Telegram-бот для бизнеса: 5 сценариев автоматизации",
    excerpt: "Реальные кейсы, которые экономят время и увеличивают продажи",
    date: "2025-01-10",
    category: "Боты",
    slug: "telegram-bot-scenarios",
  },
  {
    id: "3",
    title: "AI-видео: тренд или необходимость?",
    excerpt: "Почему бизнесы переходят на AI-видео и как это влияет на конверсию",
    date: "2025-01-05",
    category: "Видео",
    slug: "ai-video-trends",
  },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
};

const categoryColors: Record<string, string> = {
  "Сайты": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Боты": "bg-green-500/15 text-green-400 border-green-500/25",
  "Видео": "bg-pink-500/15 text-pink-400 border-pink-500/25",
  "Mini App": "bg-orange-500/15 text-orange-400 border-orange-500/25",
};

export function NewsSection() {
  const shouldReduceMotion = usePrefersReducedMotion();
  
  return (
    <section className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="flex items-center justify-between mb-8 md:mb-10"
        >
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Полезно для бизнеса
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Разборы, кейсы и практические советы
            </p>
          </div>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {ARTICLES.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ 
                duration: shouldReduceMotion ? 0 : 0.4, 
                delay: index * 0.08 
              }}
            >
              <Link
                to={`/blog/${article.slug}`}
                className={cn(
                  "group block h-full",
                  "rounded-[20px] lg:rounded-[24px]",
                  "p-5 md:p-6",
                  "bg-foreground/[0.02] dark:bg-white/[0.025]",
                  "border border-foreground/[0.06] dark:border-white/[0.06]",
                  "hover:bg-foreground/[0.05] dark:hover:bg-white/[0.05]",
                  "hover:border-foreground/[0.12] dark:hover:border-white/[0.12]",
                  "transition-all duration-300"
                )}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col h-full min-h-[160px]"
                >
                  {/* Meta: Category + Date */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg",
                      "text-xs font-medium",
                      "border",
                      categoryColors[article.category] || "bg-muted text-muted-foreground border-border"
                    )}>
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.date)}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground/80 line-clamp-2 flex-1">
                    {article.excerpt}
                  </p>
                  
                  {/* Read more */}
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    Читать
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </motion.div>
              </Link>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
