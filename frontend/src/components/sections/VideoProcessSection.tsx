"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { Container } from "@/components/common/Container";
import { ArrowRight } from "lucide-react";

interface ProcessStep {
  number: number;
  title: string;
  isLink?: boolean;
  linkUrl?: string;
}

const steps: ProcessStep[] = [
  {
    number: 1,
    title: "Описываете задачу — AI-агент создаёт стратегию под контролем опытных специалистов",
  },
  {
    number: 2,
    title: "Показываем демо-продукт, даём протестировать и понять, как всё будет выглядеть",
  },
  {
    number: 3,
    title: "Разрабатываем проект в краткие сроки с гарантированным результатом",
    isLink: true,
    linkUrl: "https://t.me/neeklo_bot",
  },
];

interface VideoProcessSectionProps {
  videoSrc?: string;
  enableAnimations?: boolean;
  className?: string;
  startScale?: number;
}

// Typewriter component with smooth animation
function TypewriterHeading({ text, isVisible }: { text: string; isVisible: boolean }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setDisplayText("");
      setCurrentIndex(0);
      setIsComplete(false);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50 + Math.random() * 30);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [isVisible, currentIndex, text]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0 select-none" aria-hidden="true">{text}</span>
      <span className="absolute inset-0">{displayText}</span>
      {isVisible && !isComplete && (
        <motion.span
          className="inline-block w-[3px] h-[0.85em] bg-primary ml-0.5 align-middle rounded-full"
          animate={{ opacity: [1, 0.4] }}
          transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      )}
    </span>
  );
}

export function VideoProcessSection({
  videoSrc = "/videos/howscrooty.mp4",
  enableAnimations = true,
  className = "",
  startScale = 0.65,
}: VideoProcessSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [scrollScale, setScrollScale] = useState(startScale);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const titleInView = useInView(titleRef, { once: true, margin: "-50px" });
  const videoInView = useInView(containerRef, { once: true, margin: "200px" });

  // Optimized scroll handler with RAF
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRef.current.offsetHeight;
    const windowHeight = window.innerHeight;

    const scrolled = Math.max(0, -rect.top);
    const maxScroll = containerHeight - windowHeight;
    const progress = Math.min(scrolled / maxScroll, 1);

    const newScale = startScale + progress * (1 - startScale);
    setScrollScale(newScale);
    setScrollProgress(progress);
  }, [startScale]);

  useEffect(() => {
    if (!enableAnimations || shouldReduceMotion) {
      setScrollScale(1);
      return;
    }

    let rafId: number;
    const onScroll = () => {
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [enableAnimations, shouldReduceMotion, handleScroll]);

  // Lazy load video when in view
  useEffect(() => {
    if (videoInView && !shouldLoadVideo) {
      setShouldLoadVideo(true);
    }
  }, [videoInView, shouldLoadVideo]);

  // Video load handlers
  const handleVideoLoaded = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
  }, []);

  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="relative h-[180vh] bg-background">
        {/* Fixed Video Container */}
        <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center z-10 overflow-hidden">
          {/* Section Title with Typewriter Effect */}
          <motion.div
            className="absolute top-8 md:top-16 left-0 right-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Container>
              <h2
                ref={titleRef}
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-center tracking-tight bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                <TypewriterHeading text="Наш подход" isVisible={titleInView} />
              </h2>
            </Container>
          </motion.div>

          {/* Video Container with Smooth Loading */}
          <div
            className="relative flex items-center justify-center will-change-transform"
            style={{
              transform: shouldAnimate ? `scale(${scrollScale})` : "scale(1)",
              transformOrigin: "center center",
              transition: shouldAnimate ? "none" : "transform 0.3s ease-out",
            }}
          >
            {/* Video Placeholder while loading */}
            <div 
              className={`absolute inset-0 bg-surface rounded-2xl md:rounded-3xl transition-opacity duration-500 ${
                videoLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              style={{
                width: "min(92vw, 1152px)",
                height: "min(45vh, 55vh)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            </div>

            {shouldLoadVideo && (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onLoadedData={handleVideoLoaded}
                onCanPlayThrough={handleVideoLoaded}
                onError={handleVideoError}
                className={`w-[92vw] md:w-[80vw] max-w-6xl h-[45vh] md:h-[55vh] object-cover rounded-2xl md:rounded-3xl transition-opacity duration-500 ${
                  videoLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  boxShadow: "0 25px 80px -12px rgba(0, 0, 0, 0.4)",
                }}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            )}

            {/* Subtle Video Gradient Overlay */}
            <div 
              className={`absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent rounded-2xl md:rounded-3xl pointer-events-none transition-opacity duration-500 ${
                videoLoaded ? "opacity-100" : "opacity-0"
              }`} 
            />
          </div>

          {/* Process Steps - Bottom */}
          <div className="absolute bottom-6 md:bottom-12 left-0 right-0 z-20">
            <Container>
              <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-start md:justify-center md:gap-x-8 lg:gap-x-12 max-w-5xl mx-auto">
                {steps.map((step, index) => {
                  const stepThreshold = (index + 1) * 0.25;
                  const isVisible = scrollProgress >= stepThreshold - 0.25;
                  const stepOpacity = shouldAnimate
                    ? Math.min(1, Math.max(0, (scrollProgress - (stepThreshold - 0.25)) * 4))
                    : 1;

                  const StepContent = (
                    <motion.div
                      key={step.number}
                      className={`flex items-start gap-3 md:gap-4 md:flex-1 md:max-w-xs ${
                        step.isLink ? "cursor-pointer group" : ""
                      }`}
                      style={{
                        opacity: shouldAnimate ? stepOpacity : 1,
                      }}
                      initial={false}
                      animate={{
                        y: shouldAnimate && !isVisible ? 15 : 0,
                        opacity: shouldAnimate ? stepOpacity : 1,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      {/* Number Circle */}
                      <div
                        className={`relative flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-500 ease-out ${
                          isVisible
                            ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,113,255,0.2)]"
                            : "border-border/40 bg-surface/20"
                        } ${step.isLink ? "group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(0,113,255,0.35)]" : ""}`}
                      >
                        <span
                          className={`text-base md:text-lg font-semibold transition-colors duration-500 ${
                            isVisible ? "text-primary" : "text-muted-foreground/40"
                          } ${step.isLink ? "group-hover:text-primary-foreground" : ""}`}
                        >
                          {step.number}
                        </span>
                      </div>

                      {/* Text */}
                      <div className="flex-1 pt-1">
                        <p
                          className={`text-sm md:text-base leading-relaxed transition-colors duration-500 ${
                            isVisible ? "text-foreground" : "text-muted-foreground/25"
                          } ${step.isLink ? "group-hover:text-primary" : ""}`}
                        >
                          {step.title}
                          {step.isLink && (
                            <ArrowRight
                              className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            />
                          )}
                        </p>
                      </div>
                    </motion.div>
                  );

                  return step.isLink ? (
                    <a
                      key={step.number}
                      href={step.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="md:flex-1 md:max-w-xs"
                    >
                      {StepContent}
                    </a>
                  ) : (
                    <React.Fragment key={step.number}>{StepContent}</React.Fragment>
                  );
                })}
              </div>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
}
