import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card } from "./Card";
import { ArrowUpRight, Play } from "lucide-react";
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

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

interface CaseCardProps {
  id: number;
  slug: string;
  title: string;
  category: string;
  coverPoster?: string;
  coverVideo?: string;
  delay?: number;
  /** Priority loading for above-the-fold images */
  priority?: boolean;
  /** Has video content */
  hasVideo?: boolean;
}

export const CaseCard = memo(function CaseCard({ 
  id, 
  slug, 
  title, 
  category, 
  coverPoster, 
  coverVideo, 
  delay = 0,
  priority = false,
  hasVideo = false
}: CaseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = usePrefersReducedMotion();

  // Get the actual cover image from our imports or use the prop
  const actualCoverImage = coverImages[slug] || coverPoster;

  // IntersectionObserver for true lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px', threshold: 0.01 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : delay }}
    >
      <Link to={`/work/${slug}`}>
        <motion.div
          whileHover={shouldReduceMotion ? {} : {}}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <Card className="group cursor-pointer relative overflow-hidden p-0 h-full card-hover">
            {/* Image/Video Container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
              {/* Skeleton loader */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-muted/30 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/40 to-transparent animate-shimmer" />
                </div>
              )}

              {/* Cover Image - Only render when in view */}
              {isInView && actualCoverImage && !imageError && (
                <img
                  src={actualCoverImage}
                  alt={title}
                  loading={priority ? "eager" : "lazy"}
                  decoding={priority ? "sync" : "async"}
                  fetchPriority={priority ? "high" : "auto"}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}

              {/* Video indicator badge */}
              {(hasVideo || coverVideo) && (
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm">
                  <Play className="w-3 h-3 text-primary" fill="currentColor" />
                  <span className="text-xs font-medium text-foreground">Video</span>
                </div>
              )}

              {/* Video Preview on Hover */}
              {coverVideo && !shouldReduceMotion && (
                <motion.video
                  src={coverVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              {/* Fallback placeholder */}
              {(imageError || !actualCoverImage) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <div className="text-6xl font-heading font-bold text-foreground/10">
                    {id}
                  </div>
                </div>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Arrow icon on hover */}
              <motion.div
                className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm rounded-full p-2"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 8 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              
              {/* Glow Effect */}
              {!shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 border-2 border-primary/0 rounded-2xl pointer-events-none"
                  animate={{
                    borderColor: isHovered ? "hsl(var(--primary) / 0.5)" : "hsl(var(--primary) / 0)",
                    boxShadow: isHovered ? "0 0 40px hsl(var(--primary) / 0.3)" : "0 0 0px hsl(var(--primary) / 0)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="mb-2">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  {category}
                </span>
              </div>
              
              <h3 className="font-heading font-semibold text-xl text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
            </div>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
});
