"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

interface ProductPackagesCompactProps {
  packages: Package[];
  telegramLink?: string;
  productTitle: string;
}

export function ProductPackagesCompact({
  packages,
  telegramLink = "https://t.me/neeklo",
  productTitle,
}: ProductPackagesCompactProps) {
  const [activeIndex, setActiveIndex] = useState(1); // Default to middle package
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSelectPackage = (pkg: Package) => {
    const message = encodeURIComponent(
      `Здравствуйте! Интересует ${productTitle} — пакет "${pkg.name}" (${pkg.price})`
    );
    window.open(`${telegramLink}?text=${message}`, "_blank");
  };

  return (
    <section id="packages" className="py-10 md:py-14">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Выберите пакет
          </h2>
          <p className="text-sm text-muted-foreground">
            Три готовых решения под разный бюджет
          </p>
        </div>

        {/* Package tabs - Mobile */}
        <div className="flex justify-center gap-1 mb-6 md:hidden">
          {packages.map((pkg, index) => (
            <button
              key={pkg.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeIndex === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {pkg.name}
            </button>
          ))}
        </div>

        {/* Mobile: Single card view */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={packages[activeIndex].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <PackageCard
                pkg={packages[activeIndex]}
                onSelect={handleSelectPackage}
                isHighlighted={activeIndex === 1}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          {packages.map((pkg, index) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onSelect={handleSelectPackage}
              isHighlighted={index === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface PackageCardProps {
  pkg: Package;
  onSelect: (pkg: Package) => void;
  isHighlighted?: boolean;
}

function PackageCard({ pkg, onSelect, isHighlighted }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative p-5 rounded-2xl",
        "border transition-all duration-300",
        isHighlighted
          ? "bg-primary/5 border-primary/30"
          : "bg-muted/30 border-border/50 hover:border-primary/20"
      )}
    >
      {/* Highlighted badge */}
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
            Популярный
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {pkg.name}
        </h3>
        <p className="text-xs text-muted-foreground">{pkg.description}</p>
      </div>

      {/* Price */}
      <div className="mb-4">
        <span className="text-2xl font-bold text-foreground">{pkg.price}</span>
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-5">
        {pkg.features.slice(0, 5).map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => onSelect(pkg)}
        className={cn(
          "w-full inline-flex items-center justify-center gap-2",
          "py-2.5 rounded-xl",
          "font-medium text-sm",
          "transition-colors",
          isHighlighted
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-foreground/5 text-foreground hover:bg-foreground/10"
        )}
      >
        <MessageCircle className="w-4 h-4" />
        Выбрать
      </button>
    </motion.div>
  );
}
