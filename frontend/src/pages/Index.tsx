import { HeroSection } from "@/components/hero/HeroSection";
import { StickyCtaButton } from "@/components/layout/StickyCtaButton";
import { SkruticSelector } from "@/components/sections/SkruticSelector";
import { VideoCasesSlider } from "@/components/sections/VideoCasesSlider";
import { ReadySolutions } from "@/components/sections/ReadySolutions";
import { NewsSection } from "@/components/sections/NewsSection";
import { ContactFormSection } from "@/components/sections/ContactFormSection";
import { Footer } from "@/components/layout/Footer";
import { StructuredData } from "@/components/common/StructuredData";
import { useMetaTags } from "@/hooks/useMetaTags";
import { usePreloadImages } from "@/hooks/usePreloadImages";

// Critical images to preload
const CRITICAL_IMAGES = [
  "/og-image.png",
];

const Index = () => {
  // Preload critical images
  usePreloadImages(CRITICAL_IMAGES);

  // Set SEO meta tags
  useMetaTags(
    "Neeklo Studio — Сайты, чат боты и видео для роста бизнеса",
    "Готовые решения под ключ за 7–14 дней. Сайты, Telegram-боты, AI-видео и Mini App.",
    "https://neeklo.studio/og-image.png",
    "https://neeklo.studio/",
    "веб-студия, разработка сайтов, telegram боты, ai видео, mini app, digital сервис"
  );

  // Organization schema for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Neeklo Studio",
    "url": "https://neeklo.studio",
    "logo": "https://neeklo.studio/logo.png",
    "description": "Готовые digital-решения для бизнеса. Запуск за 7–14 дней.",
    "sameAs": [
      "https://t.me/neeklo",
      "https://instagram.com/neeklo",
      "https://linkedin.com/company/neeklo",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@neeklo.studio",
      "contactType": "customer service",
      "availableLanguage": ["Russian", "English"],
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={organizationSchema} />
      
      <main className="pb-24 lg:pb-0 pt-0">
        {/* Hero Section - Video background with modern design */}
        <HeroSection />
        
        {/* Sticky CTA Button */}
        <StickyCtaButton />
        
        {/* Video Cases Slider - кейсы, доверие */}
        <section id="cases">
          <VideoCasesSlider />
        </section>
        
        {/* Скрутик - интерактивный селектор после кейсов */}
        <section id="selector">
          <SkruticSelector />
        </section>
        
        {/* Ready Solutions with pricing */}
        <section id="products">
          <ReadySolutions />
        </section>
        
        {/* News & Articles - SEO и доверие */}
        <NewsSection />
        
        {/* Contact Form Section - светлая тема */}
        <section id="contact">
          <ContactFormSection />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
