import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useMetaTags } from "@/hooks/useMetaTags";
import { StructuredData } from "@/components/common/StructuredData";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import casesData from "@/data/cases.json";

type CategoryFilter = "all" | "AI" | "Web" | "Telegram" | "Video" | "Branding";

const categories: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "AI", label: "AI" },
  { value: "Web", label: "Web" },
  { value: "Telegram", label: "Telegram" },
  { value: "Video", label: "Video" },
  { value: "Branding", label: "Branding" },
];

const categoryColors: Record<string, string> = {
  "AI": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "AI-Video": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Video": "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "Web": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Telegram": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Branding": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Consulting": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const ITEMS_PER_PAGE = 12;

// Generate structured data for cases portfolio
const casesStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Кейсы Neeklo Studio",
  "description": "Портфолио digital-студии: AI-агенты, веб-сайты, Telegram-боты, видеопродакшн",
  "url": "https://neeklo.ru/cases",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Портфолио проектов",
    "numberOfItems": casesData.length,
    "itemListElement": casesData.slice(0, 20).map((caseItem, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": caseItem.title,
        "description": caseItem.results?.[0] || caseItem.description,
        "url": `https://neeklo.ru/work/${caseItem.slug}`,
        "creator": {
          "@type": "Organization",
          "name": "Neeklo Studio"
        },
        "genre": caseItem.category
      }
    }))
  }
};

const Cases = () => {
  useMetaTags(
    "Кейсы и портфолио — Neeklo Studio | 50+ проектов",
    "Портфолио digital-студии: AI-агенты, веб-сайты, Telegram-боты, AI-видео. 50+ проектов с измеримыми результатами для бизнеса.",
    "https://neeklo.ru/og-cases.jpg",
    "https://neeklo.ru/cases",
    "кейсы neeklo, портфолио веб-студии, примеры сайтов, примеры ботов, ai кейсы"
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = (searchParams.get("category") as CategoryFilter) || "all";
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  const filteredCases = useMemo(() => {
    if (currentCategory === "all") return casesData;
    return casesData.filter((c) => {
      const cat = c.category?.toLowerCase() || "";
      const filter = currentCategory.toLowerCase();
      return cat.includes(filter) || cat === filter;
    });
  }, [currentCategory]);

  const displayedCases = filteredCases.slice(0, visibleItems);
  const hasMore = visibleItems < filteredCases.length;

  const handleCategoryChange = (category: CategoryFilter) => {
    setSearchParams(category === "all" ? {} : { category });
    setVisibleItems(ITEMS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={casesStructuredData} />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-12 md:py-16">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center mb-10"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Кейсы
              </h1>
              <p className="text-lg text-muted-foreground">
                Реальные проекты с измеримыми результатами
              </p>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-10 px-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`px-5 py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-all duration-200 ${
                    currentCategory === cat.value
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 active:bg-muted/70"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Cases Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              >
                {displayedCases.map((caseItem, index) => (
                  <motion.div
                    key={caseItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                  >
                    <Link
                      to={`/work/${caseItem.slug}`}
                      className="group block h-full"
                    >
                      <div className="relative h-full p-5 md:p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                        {/* Category Badge */}
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-4 ${categoryColors[caseItem.category] || "bg-muted text-muted-foreground border-border"}`}>
                          {caseItem.category}
                        </span>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {caseItem.client || caseItem.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {caseItem.results?.[0] || caseItem.description}
                        </p>

                        {/* Metrics */}
                        {caseItem.metrics && caseItem.metrics.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {caseItem.metrics.slice(0, 2).map((metric: any, i: number) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary"
                              >
                                {typeof metric === "string" ? metric : metric.value}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Arrow */}
                        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Load More */}
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisibleItems((prev) => prev + ITEMS_PER_PAGE)}
                  className="px-8 py-4 min-h-[48px] rounded-full bg-muted text-foreground font-medium hover:bg-muted/80 active:bg-muted/70 transition-colors"
                >
                  Показать ещё
                </button>
              </div>
            )}

            {/* Empty State */}
            {displayedCases.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  Кейсов в этой категории пока нет
                </p>
              </div>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cases;
