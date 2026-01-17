import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, FileText, Package, Briefcase, Users } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  category: string;
  icon: React.ReactNode;
}

// Static searchable content
const searchableContent: SearchResult[] = [
  {
    id: "products",
    title: "Продукты",
    excerpt: "AI-агенты, веб-сайты, Telegram-боты, AI-видео и автоматизация",
    href: "#products",
    category: "Секция",
    icon: <Package className="w-4 h-4" />,
  },
  {
    id: "services",
    title: "Услуги",
    excerpt: "Полный спектр digital-услуг для вашего бизнеса",
    href: "#services",
    category: "Секция",
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    id: "cases",
    title: "Кейсы",
    excerpt: "Примеры успешных проектов и реализованных решений",
    href: "#cases",
    category: "Секция",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "process",
    title: "Процесс работы",
    excerpt: "Этапы разработки: диагностика, стратегия, дизайн, разработка",
    href: "#process",
    category: "Секция",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "about",
    title: "О нас",
    excerpt: "Команда Neeklo Studio и наш подход к работе",
    href: "#about",
    category: "Секция",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "ai-agent",
    title: "AI-агенты",
    excerpt: "Интеллектуальные ассистенты для автоматизации бизнес-процессов",
    href: "/products/ai-agent",
    category: "Продукт",
    icon: <Package className="w-4 h-4" />,
  },
  {
    id: "website",
    title: "Веб-сайты",
    excerpt: "Современные адаптивные сайты с уникальным дизайном",
    href: "/products/website",
    category: "Продукт",
    icon: <Package className="w-4 h-4" />,
  },
  {
    id: "telegram-bot",
    title: "Telegram-боты",
    excerpt: "Автоматизация коммуникации и бизнес-процессов в Telegram",
    href: "/products/telegram-bot",
    category: "Продукт",
    icon: <Package className="w-4 h-4" />,
  },
  {
    id: "ai-video",
    title: "AI-видео",
    excerpt: "Генерация видеоконтента с помощью искусственного интеллекта",
    href: "/products/ai-video",
    category: "Продукт",
    icon: <Package className="w-4 h-4" />,
  },
  {
    id: "automation",
    title: "Автоматизация",
    excerpt: "Оптимизация рабочих процессов и интеграция систем",
    href: "/products/automation",
    category: "Продукт",
    icon: <Package className="w-4 h-4" />,
  },
  {
    id: "contact",
    title: "Контакты",
    excerpt: "Свяжитесь с нами для обсуждения вашего проекта",
    href: "/contact",
    category: "Страница",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "work",
    title: "Портфолио",
    excerpt: "Наши работы и реализованные проекты",
    href: "/work",
    category: "Страница",
    icon: <Briefcase className="w-4 h-4" />,
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = usePrefersReducedMotion();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Live search with debounce
  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const filtered = searchableContent.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.excerpt.toLowerCase().includes(lowerQuery) ||
          item.category.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
      setSelectedIndex(0);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        handleResultClick(results[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleResultClick = (result: SearchResult) => {
    if (result.href.startsWith("#")) {
      const element = document.getElementById(result.href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", result.href);
      }
    } else {
      window.location.href = result.href;
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 100 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className="fixed top-[5%] sm:top-[10%] left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-[600px] max-h-[90vh] z-[201] touch-pan-x"
          >
            <div className="bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
              {/* Drag handle for mobile */}
              <div className="flex justify-center pt-2 pb-1 md:hidden">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 pt-2 md:pt-4 border-b border-border/30">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск по сайту..."
                  className="flex-1 bg-transparent text-foreground text-lg placeholder:text-muted-foreground outline-none"
                />
                <div className="flex items-center gap-2">
                  <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-mono text-muted-foreground bg-secondary rounded">
                    ESC
                  </kbd>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    aria-label="Закрыть поиск"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto flex-1">
                {query.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground text-sm">
                      Начните вводить для поиска...
                    </p>
                    <p className="text-muted-foreground/60 text-xs mt-2">
                      Нажмите <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">⌘K</kbd> для быстрого доступа
                    </p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">Ничего не найдено</p>
                    <p className="text-muted-foreground/60 text-sm mt-1">
                      Попробуйте изменить запрос
                    </p>
                  </div>
                ) : (
                  <div className="p-2">
                    {results.map((result, index) => (
                      <motion.button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200",
                          selectedIndex === index
                            ? "bg-primary/10 border-l-2 border-primary"
                            : "hover:bg-secondary/50"
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <div className={cn(
                          "p-2 rounded-lg flex-shrink-0",
                          selectedIndex === index ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                        )}>
                          {result.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground truncate">
                              {result.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded text-muted-foreground flex-shrink-0">
                              {result.category}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {result.excerpt}
                          </p>
                        </div>
                        <ArrowRight className={cn(
                          "w-4 h-4 flex-shrink-0 transition-all",
                          selectedIndex === index ? "text-primary translate-x-0 opacity-100" : "text-muted-foreground -translate-x-2 opacity-0"
                        )} />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {results.length > 0 && (
                <div className="p-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-secondary rounded mr-1">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-secondary rounded mr-1">↓</kbd>
                    для навигации
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-secondary rounded">Enter</kbd>
                    для перехода
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
