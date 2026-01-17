import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/common/Container";

interface ProductHeroMinimalProps {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryCta?: {
    text: string;
    scrollTo: string;
  };
  mockup?: React.ReactNode;
}

export const ProductHeroMinimal = ({
  badge,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  mockup,
}: ProductHeroMinimalProps) => {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-[80svh] sm:min-h-[90svh] lg:min-h-[100svh] flex items-center py-8 sm:py-12 md:py-16 lg:py-20">
      <Container>
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            className="text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3 sm:mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-[10px] sm:text-xs font-medium text-primary uppercase tracking-wider">{badge}</span>
            </motion.div>

            {/* Title - responsive sizing */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] mb-3 sm:mb-4">
              {title}
            </h1>

            {/* Subtitle - responsive */}
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-muted-foreground leading-relaxed mb-5 sm:mb-6 max-w-lg mx-auto lg:mx-0">
              {subtitle}
            </p>

            {/* CTAs - full width on mobile, inline on tablet+ */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center lg:justify-start">
              {primaryCta.onClick ? (
                <button
                  onClick={primaryCta.onClick}
                  className="inline-flex items-center justify-center w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] min-h-[44px] sm:min-h-[48px]"
                >
                  {primaryCta.text}
                </button>
              ) : (
                <a
                  href={primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] min-h-[44px] sm:min-h-[48px]"
                >
                  {primaryCta.text}
                </a>
              )}

              {secondaryCta && (
                <button
                  onClick={() => handleScrollTo(secondaryCta.scrollTo)}
                  className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-border bg-surface/50 text-foreground font-medium text-sm sm:text-base transition-all hover:bg-surface hover:border-primary/30 active:scale-[0.98] min-h-[44px] sm:min-h-[48px]"
                >
                  {secondaryCta.text}
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Mockup - hidden on very small screens, compact on mobile */}
          {mockup && (
            <motion.div
              className="relative order-1 lg:order-2 max-w-[220px] xs:max-w-[260px] sm:max-w-sm mx-auto lg:max-w-none hidden xs:block"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              {mockup}
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
};