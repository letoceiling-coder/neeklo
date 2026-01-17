import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { CaseCard } from "@/components/common/CaseCard";
import { Button } from "@/components/common/Button";
import { useMetaTags } from "@/hooks/useMetaTags";
import { StructuredData } from "@/components/common/StructuredData";
import casesData from "@/data/cases.json";

const categories = [
  { id: "all", label: "Все" },
  { id: "Web", label: "Web" },
  { id: "AI", label: "AI" },
  { id: "AI-Video", label: "AI-Video" },
  { id: "TG-Bot", label: "TG-Bot" },
  { id: "Mini-App", label: "Mini-App" },
  { id: "Video", label: "Video" },
  { id: "Branding", label: "Branding" },
  { id: "Consulting", label: "Consulting" },
];

const ITEMS_PER_PAGE = 12;

// Structured data for portfolio page
const workStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Портфолио Neeklo Studio",
  "description": "Избранные проекты digital-студии — веб-дизайн, AI-решения, Telegram-боты, брендинг",
  "url": "https://neeklo.ru/work",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Избранные проекты",
    "numberOfItems": casesData.length,
    "itemListElement": casesData.slice(0, 15).map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": project.title,
        "description": project.description || project.results?.[0],
        "url": `https://neeklo.ru/work/${project.slug}`,
        "creator": {
          "@type": "Organization",
          "name": "Neeklo Studio"
        },
        "genre": project.category
      }
    }))
  }
};

const Work = () => {
  useMetaTags(
    "Портфолио проектов — Neeklo Studio | Кейсы и работы",
    "50+ избранных проектов: веб-сайты, AI-решения, Telegram-боты, брендинг. Реальные результаты для стартапов и крупных брендов.",
    "https://neeklo.ru/og-work.jpg",
    "https://neeklo.ru/work",
    "портфолио neeklo, проекты студии, кейсы веб-разработки, примеры работ, брендинг кейсы"
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  const filteredCases = useMemo(() => {
    if (categoryParam === "all") {
      return casesData;
    }
    return casesData.filter(c => c.category === categoryParam);
  }, [categoryParam]);

  const displayedCases = filteredCases.slice(0, visibleItems);
  const hasMore = visibleItems < filteredCases.length;

  const handleCategoryChange = (category: string) => {
    setSearchParams(category === "all" ? {} : { category });
    setVisibleItems(ITEMS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + ITEMS_PER_PAGE, filteredCases.length));
  };

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={workStructuredData} />
      <main className="pt-32 pb-20">
        <Container>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold mb-6">
              Наши{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                проекты
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Кейсы, которыми мы гордимся. От стартапов до крупных брендов.
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-16"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  categoryParam === category.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          {/* Cases Grid */}
          <motion.div
            key={categoryParam}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {displayedCases.map((project, index) => (
              <CaseCard
                key={project.id}
                id={project.id}
                slug={project.slug}
                title={project.title}
                category={project.category}
                coverPoster={project.coverPoster}
                coverVideo={project.coverVideo}
                delay={index * 0.05}
                priority={index < 3}
                hasVideo={project.gallery?.some(g => g.type === 'video') || !!project.coverVideo}
              />
            ))}
          </motion.div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={loadMore}
                className="group"
              >
                Загрузить ещё
              </Button>
            </div>
          )}

          {/* Empty State */}
          {filteredCases.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                Проектов в этой категории пока нет
              </p>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default Work;
