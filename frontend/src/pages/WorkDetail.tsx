import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useMetaTags } from "@/hooks/useMetaTags";
import { StructuredData } from "@/components/common/StructuredData";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Clock, Users, Layers, CheckCircle } from "lucide-react";
import { VideoPlayer } from "@/components/common/VideoPlayer";
import { CaseMediaGallery } from "@/components/sections/CaseMediaGallery";
import casesData from "@/data/cases.json";

// Import cover images
import povuzamCover from "@/assets/cases/povuzam-cover.jpg";
import batnortonCover from "@/assets/cases/batnorton-cover.jpg";
import mnkaCover from "@/assets/cases/mnka-cover.jpg";
import glampingCover from "@/assets/cases/glamping-cover.jpg";
import aiAgentCover from "@/assets/cases/ai-agent-cover.jpg";
import aiVideoCover from "@/assets/cases/ai-video-cover.jpg";

// Map slugs to cover images
const coverImages: Record<string, string> = {
  "povuzam": povuzamCover,
  "batnorton": batnortonCover,
  "mnka": mnkaCover,
  "glamping": glampingCover,
  "ai-agent": aiAgentCover,
  "ai-video": aiVideoCover,
};

const WorkDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const caseData = casesData.find(c => c.slug === slug);
  const currentIndex = casesData.findIndex(c => c.slug === slug);
  const nextCase = casesData[currentIndex + 1] || casesData[0];
  const prevCase = casesData[currentIndex - 1] || casesData[casesData.length - 1];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!caseData) {
    return <Navigate to="/work" replace />;
  }

  useMetaTags(
    `${caseData.title} | Neeklo Studio`,
    caseData.description,
    `https://neeklo.ru/cases/${caseData.coverPoster}`,
    `https://neeklo.ru/work/${caseData.slug}`,
    `${caseData.title}, ${caseData.category}, кейс, проект`
  );

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": caseData.title,
    "description": caseData.description,
    "url": `https://neeklo.ru/work/${caseData.slug}`,
    "creator": {
      "@type": "Organization",
      "name": "Neeklo Studio",
      "url": "https://neeklo.ru"
    },
    "datePublished": `${caseData.year}-01-01`,
    "keywords": caseData.category
  };

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={creativeWorkSchema} />
      
      <main className="pt-20 md:pt-24 lg:pt-28 pb-16">
        <Container className="py-3 md:py-4">
          <Breadcrumbs
            items={[
              { label: "Проекты", url: "/work" },
              { label: caseData.title, url: `/work/${caseData.slug}` },
            ]}
          />
        </Container>
        
        <Container className="pt-0">

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 mb-12"
          >
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              {caseData.category}
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 leading-tight">
              {caseData.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
              {caseData.description}
            </p>
          </motion.div>

          {/* Project Visual - Cover Image or Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            {caseData.coverVideo ? (
              <VideoPlayer
                src={caseData.coverVideo}
                poster={coverImages[caseData.slug]}
                title={caseData.title}
                priority
                className="w-full rounded-2xl shadow-2xl"
              />
            ) : coverImages[caseData.slug] ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={coverImages[caseData.slug]}
                  alt={caseData.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>
            ) : (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[120px] md:text-[200px] font-bold text-foreground/5">{caseData.id}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick Info Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            <div className="glass-effect rounded-xl p-4 md:p-6">
              <Users className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Клиент</p>
              <p className="font-medium text-sm md:text-base">{caseData.client}</p>
            </div>
            <div className="glass-effect rounded-xl p-4 md:p-6">
              <Layers className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Роль</p>
              <p className="font-medium text-sm md:text-base line-clamp-2">{caseData.role}</p>
            </div>
            <div className="glass-effect rounded-xl p-4 md:p-6">
              <Clock className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Срок</p>
              <p className="font-medium text-sm md:text-base">{caseData.duration}</p>
            </div>
            <div className="glass-effect rounded-xl p-4 md:p-6">
              <CheckCircle className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Год</p>
              <p className="font-medium text-sm md:text-base">{caseData.year}</p>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6">Результаты</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {caseData.results.map((result, index) => (
                <div key={index} className="glass-effect rounded-xl p-6 border-l-4 border-primary">
                  <p className="text-foreground font-medium">{result}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Metrics Section */}
          {caseData.metrics && caseData.metrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-16"
            >
              <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6">Метрики</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {caseData.metrics.map((metric, index) => (
                  <div key={index} className="glass-effect rounded-xl p-6 text-center">
                    <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6">Технологии</h2>
            <div className="flex flex-wrap gap-3">
              {caseData.stack.map((tech, index) => (
                <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Media Gallery */}
          {caseData.gallery && caseData.gallery.length > 0 && (
            <CaseMediaGallery 
              items={caseData.gallery.map(item => ({
                type: item.type as 'image' | 'video',
                src: item.src,
                alt: item.alt,
                poster: item.type === 'video' ? coverImages[caseData.slug] : undefined
              }))} 
              title="Галерея проекта" 
            />
          )}

          {/* Testimonial */}
          {caseData.testimonial && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-16"
            >
              <div className="glass-effect rounded-2xl p-8 md:p-10">
                <p className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                  "{caseData.testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold">{caseData.testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{caseData.testimonial.position}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-border"
          >
            <Link 
              to={`/work/${prevCase.slug}`}
              className="flex items-center gap-3 group glass-effect rounded-xl p-4 hover:border-primary/50 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
              <div>
                <p className="text-xs text-muted-foreground">Предыдущий</p>
                <p className="font-medium line-clamp-1">{prevCase.title}</p>
              </div>
            </Link>
            <Link 
              to={`/work/${nextCase.slug}`}
              className="flex items-center justify-end gap-3 group glass-effect rounded-xl p-4 hover:border-primary/50 transition-all"
            >
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Следующий</p>
                <p className="font-medium line-clamp-1">{nextCase.title}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default WorkDetail;
