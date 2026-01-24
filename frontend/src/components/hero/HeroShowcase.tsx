"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { SolutionsGrid } from "./SolutionsGrid";

export const HeroShowcase = memo(function HeroShowcase() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Mobile Layout - clean and spacious */}
      <div className="lg:hidden flex flex-col items-center w-full px-5">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center text-center mb-8 max-w-[320px] mx-auto"
        >
          {/* H1 - clean typography, no orphans */}
          <h1 
            className="text-[25px] sm:text-[29px] font-semibold tracking-[-0.02em] text-foreground mb-3 leading-[1.28]"
            style={{ textWrap: 'balance' }}
          >
            Сайты, чат-боты{" "}
            <span className="whitespace-nowrap">и видео</span>
            <br />
            для роста бизнеса
          </h1>
          
          {/* Subheadline - simple */}
          <p className="text-[15px] text-muted-foreground/70 font-normal leading-relaxed">
            Выберите решение для себя
          </p>
        </motion.div>

        {/* Solutions Grid 2x2 - main interaction */}
        <SolutionsGrid variant="mobile" />
      </div>

      {/* Desktop Layout - centered, spacious */}
      <div className="hidden lg:flex flex-col items-center w-full max-w-4xl mx-auto px-8">
        {/* Header - centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center text-center mb-12 mx-auto"
        >
          {/* Desktop Headline */}
          <h1 
            className="text-[48px] xl:text-[56px] font-semibold tracking-[-0.03em] text-foreground mb-4 leading-[1.15]"
          >
            Сайты, чат-боты и видео
            <br />
            для роста бизнеса
          </h1>
          
          {/* Desktop Subheadline */}
          <p className="text-[17px] xl:text-[18px] text-muted-foreground/60 font-normal">
            Выберите решение для себя
          </p>
        </motion.div>

        {/* Product Grid - 4 in a row on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <SolutionsGrid variant="desktop" />
        </motion.div>
      </div>
    </div>
  );
});
