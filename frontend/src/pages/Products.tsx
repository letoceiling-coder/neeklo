import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useMetaTags } from "@/hooks/useMetaTags";
import { StructuredData } from "@/components/common/StructuredData";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Product catalog - clean, price-first format
const products = [
  {
    slug: "website",
    title: "Сайт для бизнеса",
    price: "от 45 000 ₽",
    timeline: "5–14 дней",
    category: "Разработка",
  },
  {
    slug: "telegram-bot",
    title: "Telegram-бот",
    price: "от 35 000 ₽",
    timeline: "5–10 дней",
    category: "Разработка",
  },
  {
    slug: "mini-app",
    title: "Mini App",
    price: "от 80 000 ₽",
    timeline: "10–21 день",
    category: "Разработка",
  },
  {
    slug: "mobile-app",
    title: "Мобильное приложение",
    price: "от 300 000 ₽",
    timeline: "от 6 недель",
    category: "Разработка",
  },
  {
    slug: "ai-agent",
    title: "AI-ассистент",
    price: "от 65 000 ₽",
    timeline: "10–21 день",
    category: "AI и нейросети",
  },
  {
    slug: "ai-video",
    title: "AI-видео",
    price: "от 25 000 ₽",
    timeline: "5–7 дней",
    category: "AI и нейросети",
  },
  {
    slug: "automation",
    title: "Автоматизация",
    price: "от 40 000 ₽",
    timeline: "7–21 день",
    category: "AI и нейросети",
  },
  {
    slug: "branding",
    title: "Брендинг",
    price: "от 30 000 ₽",
    timeline: "7–14 дней",
    category: "Дизайн",
  },
  {
    slug: "crm",
    title: "CRM-интеграции",
    price: "от 35 000 ₽",
    timeline: "5–14 дней",
    category: "Сервис",
  },
  {
    slug: "ecosystem",
    title: "Digital-экосистема",
    price: "от 200 000 ₽",
    timeline: "от 30 дней",
    category: "Комплекс",
  },
  {
    slug: "support",
    title: "Техподдержка",
    price: "от 25 000 ₽/мес",
    timeline: "постоянно",
    category: "Сервис",
  },
  {
    slug: "consulting",
    title: "Консалтинг",
    price: "от 15 000 ₽",
    timeline: "от 1 дня",
    category: "Сервис",
  },
];

// Category colors for badges
const categoryColors: Record<string, string> = {
  "Разработка": "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25",
  "AI и нейросети": "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25",
  "Дизайн": "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/25",
  "Сервис": "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/25",
  "Комплекс": "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/25",
};

// Generate structured data for products
const productsStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Digital-продукты Neeklo Studio",
  "description": "Разработка сайтов, Telegram-ботов, AI-видео и AI-ассистентов для бизнеса",
  "numberOfItems": products.length,
  "itemListElement": products.map((product, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Service",
      "name": product.title,
      "url": `https://neeklo.ru/products/${product.slug}`,
      "provider": {
        "@type": "Organization",
        "name": "Neeklo Studio"
      },
      "offers": {
        "@type": "Offer",
        "price": product.price.replace(/[^\d]/g, ''),
        "priceCurrency": "RUB",
      }
    }
  }))
};

const Products = () => {
  useMetaTags(
    "Каталог решений — Neeklo Studio",
    "12 digital-решений для бизнеса с ценами и сроками. Выберите подходящее решение.",
    "https://neeklo.ru/og-products.jpg",
    "https://neeklo.ru/products",
    "разработка сайтов цена, создание telegram бота стоимость, ai ассистент, ai видео"
  );

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={productsStructuredData} />
      <main className="pt-24 pb-16">
        {/* Minimal Header */}
        <section className="py-8 md:py-12">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto text-center mb-10"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                Каталог решений
              </h1>
              <p className="text-muted-foreground">
                Цены и сроки — всё прозрачно
              </p>
            </motion.div>

            {/* Products Grid - clean cards with price + timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {products.map((product, index) => (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                >
                  <div
                    className={cn(
                      "group relative h-full",
                      "rounded-[20px] md:rounded-[24px]",
                      "p-5 md:p-6",
                      "bg-foreground/[0.02] dark:bg-white/[0.025]",
                      "border border-foreground/[0.06] dark:border-white/[0.06]",
                      "hover:bg-foreground/[0.04] dark:hover:bg-white/[0.04]",
                      "hover:border-foreground/[0.1] dark:hover:border-white/[0.1]",
                      "transition-all duration-300"
                    )}
                  >
                    {/* Category badge */}
                    <span className={cn(
                      "inline-block px-2.5 py-1 rounded-lg mb-4",
                      "text-xs font-medium border",
                      categoryColors[product.category] || "bg-muted text-muted-foreground border-border"
                    )}>
                      {product.category}
                    </span>

                    {/* Title */}
                    <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3">
                      {product.title}
                    </h2>

                    {/* Price + Timeline */}
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-5">
                      <span className="text-base font-semibold text-foreground">
                        {product.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        · {product.timeline}
                      </span>
                    </div>

                    {/* CTA Button - only clickable element */}
                    <Link
                      to={`/products/${product.slug}`}
                      className={cn(
                        "inline-flex items-center gap-2",
                        "px-4 py-2.5 rounded-xl",
                        "text-sm font-medium",
                        "bg-foreground/[0.04] dark:bg-white/[0.06]",
                        "text-foreground",
                        "hover:bg-primary/10 hover:text-primary",
                        "border border-transparent hover:border-primary/20",
                        "transition-all duration-200"
                      )}
                    >
                      Подробнее
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
