import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight, FileText, Package, Briefcase, Users, Video, Bot, Globe, Cog, Palette, Smartphone, Zap, Target, MessageCircle } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  category: string;
  icon: React.ReactNode;
  keywords: string[]; // Дополнительные ключевые слова для поиска
}

// Расширенный поисковый контент со всеми ключевыми словами
const searchableContent: SearchResult[] = [
  // Главные секции
  {
    id: "products",
    title: "Продукты",
    excerpt: "AI-агенты, веб-сайты, Telegram-боты, AI-видео и автоматизация",
    href: "/products",
    category: "Секция",
    icon: <Package className="w-4 h-4" />,
    keywords: ["каталог", "товары", "услуги", "решения", "digital", "продукция"],
  },
  {
    id: "cases",
    title: "Кейсы",
    excerpt: "Примеры успешных проектов и реализованных решений",
    href: "/work",
    category: "Секция",
    icon: <FileText className="w-4 h-4" />,
    keywords: ["портфолио", "работы", "проекты", "примеры", "результаты", "кейсы"],
  },
  {
    id: "process",
    title: "Процесс работы",
    excerpt: "Этапы разработки: диагностика, стратегия, дизайн, разработка",
    href: "/process",
    category: "Секция",
    icon: <FileText className="w-4 h-4" />,
    keywords: ["как мы работаем", "этапы", "методология", "диагностика", "стратегия", "разработка"],
  },
  {
    id: "about",
    title: "О нас",
    excerpt: "Команда Neeklo Studio и наш подход к работе",
    href: "/about",
    category: "Страница",
    icon: <Users className="w-4 h-4" />,
    keywords: ["команда", "студия", "о компании", "подход", "философия"],
  },
  {
    id: "contact",
    title: "Контакты",
    excerpt: "Свяжитесь с нами для обсуждения вашего проекта",
    href: "/contact",
    category: "Страница",
    icon: <MessageCircle className="w-4 h-4" />,
    keywords: ["связаться", "написать", "заявка", "телефон", "email", "telegram"],
  },
  
  // Продукты
  {
    id: "ai-agent",
    title: "AI-агент",
    excerpt: "Интеллектуальные ассистенты для автоматизации бизнес-процессов, поддержка, продажи, HR",
    href: "/products/ai-agent",
    category: "Продукт",
    icon: <Bot className="w-4 h-4" />,
    keywords: ["искусственный интеллект", "ассистент", "нейросеть", "чат-бот", "автоматизация", "поддержка клиентов", "продажи", "hr"],
  },
  {
    id: "website",
    title: "Сайт для бизнеса",
    excerpt: "Современные адаптивные сайты с уникальным дизайном, лендинги, корпоративные сайты, SEO",
    href: "/products/website",
    category: "Продукт",
    icon: <Globe className="w-4 h-4" />,
    keywords: ["веб-сайт", "лендинг", "landing page", "корпоративный сайт", "сайт-визитка", "интернет-магазин", "seo", "дизайн"],
  },
  {
    id: "telegram-bot",
    title: "Telegram-бот",
    excerpt: "Автоматизация коммуникации и бизнес-процессов в Telegram, интеграции, оплата, рассылки",
    href: "/products/telegram-bot",
    category: "Продукт",
    icon: <Bot className="w-4 h-4" />,
    keywords: ["телеграм", "телеграм бот", "бот", "автоматизация", "рассылки", "оплата", "webapp", "mini app"],
  },
  {
    id: "ai-video",
    title: "AI-видео",
    excerpt: "Генерация видеоконтента с помощью искусственного интеллекта, реклама, презентации, соцсети",
    href: "/products/ai-video",
    category: "Продукт",
    icon: <Video className="w-4 h-4" />,
    keywords: ["видео", "видеоконтент", "reels", "реклама", "промо", "видео-продакшн", "нейросети", "генерация видео"],
  },
  {
    id: "mini-app",
    title: "Mini App",
    excerpt: "Приложения внутри Telegram для вашего бизнеса",
    href: "/products/mini-app",
    category: "Продукт",
    icon: <Smartphone className="w-4 h-4" />,
    keywords: ["мини апп", "telegram mini app", "приложение", "webapp", "веб-приложение"],
  },
  {
    id: "automation",
    title: "Автоматизация",
    excerpt: "Оптимизация рабочих процессов и интеграция систем, CRM, воронки, пайплайны",
    href: "/products/automation",
    category: "Продукт",
    icon: <Cog className="w-4 h-4" />,
    keywords: ["автоматизация процессов", "интеграция", "crm", "воронки", "пайплайны", "workflow", "бизнес-процессы"],
  },
  {
    id: "branding",
    title: "Брендинг",
    excerpt: "Айдентика и стиль для вашего бренда, логотип, фирменный стиль",
    href: "/products/branding",
    category: "Продукт",
    icon: <Palette className="w-4 h-4" />,
    keywords: ["айдентика", "логотип", "фирменный стиль", "брендбук", "дизайн", "брендинг"],
  },
  {
    id: "crm",
    title: "CRM-интеграции",
    excerpt: "Интеграция с CRM-системами для автоматизации продаж",
    href: "/products/crm",
    category: "Продукт",
    icon: <Package className="w-4 h-4" />,
    keywords: ["crm", "система управления", "продажи", "интеграция crm", "amoCRM", "bitrix24"],
  },
  {
    id: "ecosystem",
    title: "Digital-экосистема",
    excerpt: "Все digital-активы — сайт, бот, CRM, AI, видео — интегрируем в единую экосистему",
    href: "/products/ecosystem",
    category: "Продукт",
    icon: <Zap className="w-4 h-4" />,
    keywords: ["экосистема", "интеграция", "комплексное решение", "360", "digital", "все в одном"],
  },
  {
    id: "mobile-app",
    title: "Мобильное приложение",
    excerpt: "Нативные приложения для iOS и Android",
    href: "/products/mobile-app",
    category: "Продукт",
    icon: <Smartphone className="w-4 h-4" />,
    keywords: ["мобильное приложение", "ios", "android", "app", "нативное приложение"],
  },
  {
    id: "support",
    title: "Поддержка",
    excerpt: "Техническая поддержка и обслуживание ваших проектов",
    href: "/products/support",
    category: "Продукт",
    icon: <MessageCircle className="w-4 h-4" />,
    keywords: ["поддержка", "обслуживание", "техподдержка", "поддержка сайта"],
  },
  {
    id: "consulting",
    title: "Консалтинг",
    excerpt: "Консультации по digital-стратегии и развитию бизнеса",
    href: "/products/consulting",
    category: "Продукт",
    icon: <Target className="w-4 h-4" />,
    keywords: ["консалтинг", "консультация", "стратегия", "развитие бизнеса", "digital стратегия"],
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
  const navigate = useNavigate();

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

  // Live search with debounce and keyword matching
  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const lowerQuery = query.toLowerCase().trim();
      const queryWords = lowerQuery.split(/\s+/).filter(Boolean);
      
      const filtered = searchableContent
        .map((item) => {
          // Проверяем все поля + keywords
          const searchText = [
            item.title.toLowerCase(),
            item.excerpt.toLowerCase(),
            item.category.toLowerCase(),
            ...(item.keywords || []).map(k => k.toLowerCase())
          ].join(' ');

          // Подсчет совпадений для ранжирования
          const matches = queryWords.filter(word => searchText.includes(word)).length;
          const exactMatch = searchText.includes(lowerQuery);
          
          // Высокий приоритет: точное совпадение в заголовке
          const titleMatch = item.title.toLowerCase().includes(lowerQuery);
          
          // Средний приоритет: начало заголовка или excerpt
          const startsWith = item.title.toLowerCase().startsWith(lowerQuery) || 
                            item.excerpt.toLowerCase().includes(lowerQuery);
          
          return {
            ...item,
            score: exactMatch ? 100 : (titleMatch ? 80 : (startsWith ? 60 : matches * 10))
          };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ score, ...item }) => item); // Убираем score из результата

      setResults(filtered);
      setSelectedIndex(0);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleResultClick = useCallback((result: SearchResult) => {
    if (result.href.startsWith("#")) {
      // Якорная ссылка - скролл к секции на текущей странице
      const element = document.getElementById(result.href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", result.href);
      }
    } else {
      // Навигация через React Router
      navigate(result.href);
    }
    onClose();
  }, [navigate, onClose]);

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
  }, [isOpen, results, selectedIndex, onClose, navigate, handleResultClick]);

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
            className={cn(
              "fixed z-[201] touch-pan-x",
              // Мобильные (320-767px): полноэкранный режим
              "inset-0 w-full h-full max-w-none rounded-none",
              // Планшеты (768-1024px): почти полноэкранный с отступами
              "md:inset-auto md:top-[5%] md:left-1/2 md:-translate-x-1/2 md:w-[90%] md:max-w-[700px] md:h-auto md:max-h-[90vh] md:rounded-2xl",
              // Десктоп (1025px+): всплывающий блок
              "lg:top-[10%] lg:max-w-[600px]"
            )}
          >
            <div className={cn(
              "bg-card border border-border/50 shadow-2xl overflow-hidden flex flex-col h-full",
              "rounded-none md:rounded-2xl",
              "md:max-h-[85vh]"
            )}>
              {/* Drag handle for mobile */}
              <div className="flex justify-center pt-3 pb-2 md:hidden">
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
                    {/* Подсказка Cmd+K только на десктопе (скрыта на мобильных и планшетах) */}
                    <p className="hidden lg:block text-muted-foreground/60 text-xs mt-2">
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
