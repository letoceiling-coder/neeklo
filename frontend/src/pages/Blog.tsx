import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useMetaTags } from "@/hooks/useMetaTags";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import { blogArticles } from "@/data/blogArticles";
import { cn } from "@/lib/utils";

const PER_PAGE = 9;

const categoryColors: Record<string, string> = {
  "Сайты": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Боты": "bg-green-500/15 text-green-400 border-green-500/25",
  "Видео": "bg-pink-500/15 text-pink-400 border-pink-500/25",
  "Mini App": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "AI": "bg-violet-500/15 text-violet-400 border-violet-500/25",
  "Автоматизация": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "Маркетинг": "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });

export default function Blog() {
  useMetaTags(
    "Блог | Neeklo Studio — Статьи о сайтах, ботах, AI и автоматизации",
    "Полезные статьи о разработке сайтов, Telegram-ботах, AI-агентах, Mini App и автоматизации бизнеса.",
    "https://neeklo.ru/og-blog.jpg",
    "https://neeklo.ru/blog",
    "блог neeklo, статьи про сайты, боты, ai, автоматизация"
  );

  const categories = useMemo(
    () => ["Все", ...[...new Set(blogArticles.map((a) => a.category))].sort()],
    []
  );

  const [topic, setTopic] = useState("Все");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (topic === "Все") return blogArticles;
    return blogArticles.filter((a) => a.category === topic);
  }, [topic]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const from = (currentPage - 1) * PER_PAGE;
  const items = useMemo(() => filtered.slice(from, from + PER_PAGE), [filtered, from]);

  const handleTopicChange = (t: string) => {
    setTopic(t);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 md:pt-24 pb-16">
        <Container className="pb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 md:mb-10"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
              Блог
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Статьи о сайтах, ботах, AI и автоматизации для бизнеса
            </p>
          </motion.div>

          {/* Фильтр по теме */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => handleTopicChange(c)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium border transition-colors",
                  topic === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Container>

        {/* Карточки статей */}
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {items.map((article, index) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Link
                  to={`/blog/${article.slug}`}
                  className={cn(
                    "group block h-full rounded-2xl p-5 md:p-6",
                    "bg-card border border-border",
                    "hover:border-primary/40 hover:bg-card/80",
                    "transition-all duration-200"
                  )}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-medium border",
                        categoryColors[article.category] || "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(article.date)}
                    </span>
                  </div>
                  <h2 className="text-base md:text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.h1}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{article.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    Читать
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>В выбранной теме пока нет статей</p>
            </div>
          )}

          {/* Пагинация */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-4 mt-10 pt-8 border-t border-border"
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium",
                  "bg-muted/80 text-foreground hover:bg-muted",
                  "disabled:opacity-50 disabled:pointer-events-none"
                )}
              >
                Назад
              </button>
              <span className="text-sm text-muted-foreground">
                Страница {currentPage} из {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium",
                  "bg-muted/80 text-foreground hover:bg-muted",
                  "disabled:opacity-50 disabled:pointer-events-none"
                )}
              >
                Вперёд
              </button>
            </motion.div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
