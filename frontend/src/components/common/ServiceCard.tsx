import { motion } from "framer-motion";
import { Globe, Palette, Video, Sparkles, Bot, Lightbulb } from "lucide-react";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

const iconMap = {
  globe: Globe,
  palette: Palette,
  video: Video,
  sparkles: Sparkles,
  bot: Bot,
  lightbulb: Lightbulb,
};

interface ServiceCardProps {
  icon: keyof typeof iconMap;
  title: string;
  excerpt: string;
  slug: string;
  delay?: number;
}

export const ServiceCard = ({ icon, title, excerpt, slug, delay = 0 }: ServiceCardProps) => {
  const Icon = iconMap[icon] || Globe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="h-full group cursor-pointer relative overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        
        <div className="flex flex-col h-full">
          {/* Icon */}
          <div className="mb-4 inline-flex p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          
          {/* Title */}
          <h3 className="font-heading font-semibold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
            {excerpt}
          </p>
          
          {/* Arrow indicator */}
          <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="mr-2">Подробнее</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
