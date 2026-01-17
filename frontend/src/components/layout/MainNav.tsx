import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { SearchModal } from "@/components/ui/SearchModal";
import { useActiveSection } from "@/hooks/useActiveSection";
import logoLight from "@/assets/logo.png";
import logoDark from "@/assets/logo-dark.png";

// Desktop nav - simplified: Каталог only
const navItems = [
  { label: "Каталог", href: "/products", sectionId: "products" },
  { label: "Кейсы", href: "/work", sectionId: "cases" },
  { label: "О нас", href: "/about", sectionId: "about" },
];

// Burger menu items (includes more pages)
const burgerMenuItems = [
  { label: "Каталог", href: "/products" },
  { label: "Кейсы", href: "/work" },
  { label: "Процесс", href: "/process" },
  { label: "О нас", href: "/about" },
  { label: "Контакты", href: "/contact" },
];

export const MainNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const shouldReduceMotion = usePrefersReducedMotion();
  const activeSection = useActiveSection();

  // Watch for dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, isSearchOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check if nav item is active (by route or by scroll section)
  const isActive = (href: string, sectionId?: string) => {
    // On homepage, use section-based highlighting
    if (location.pathname === '/' && sectionId && activeSection) {
      return sectionId === activeSection;
    }
    // On other pages, use route-based highlighting
    if (href === '/products') {
      return location.pathname === '/products' || location.pathname.startsWith('/products/');
    }
    if (href === '/work') {
      return location.pathname === '/work' || location.pathname.startsWith('/work/');
    }
    return location.pathname === href;
  };

  // Get appropriate logo based on theme
  const currentLogo = isDarkMode ? logoLight : logoDark;

  return (
    <>
      {/* Fixed Header Container - ALWAYS fixed at top */}
      <header 
        className="fixed top-0 left-0 right-0 w-full z-[9999]"
        style={{ position: 'fixed' }}
        role="navigation"
        aria-label="Главная навигация"
      >
        {/* Wrapper with dynamic padding */}
        <div className={cn(
          "w-full flex justify-center transition-all duration-500 ease-out",
          scrolled ? "pt-3 px-4" : "pt-0 px-0"
        )}>
          {/* Nav Container */}
          <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: shouldReduceMotion ? 0 : 0.4, 
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn(
              "flex items-center justify-between transition-all duration-500 ease-out",
              scrolled ? [
                // Scrolled: Compact glass pill
                "max-w-5xl w-auto",
                "rounded-full px-3 py-2",
                "bg-background/95",
                "backdrop-blur-2xl backdrop-saturate-150",
                "border border-border/40",
                "shadow-xl shadow-foreground/5",
              ] : [
                // Zero scroll: Full width, solid background
                "w-full max-w-none",
                "px-6 md:px-8 lg:px-12 py-4 md:py-5",
                "bg-background",
                "rounded-none border-transparent",
              ]
            )}
          >
            {/* Logo */}
            <Link 
              to="/" 
              className={cn(
                "relative z-50 flex items-center flex-shrink-0 transition-all duration-500",
                scrolled ? "pl-2" : "pl-0"
              )}
            >
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <img
                  src={currentLogo}
                  alt="Neeklo Studio"
                  loading="eager"
                  decoding="async"
                  className={cn(
                    "w-auto transition-all duration-500 ease-out",
                    scrolled ? "h-8 md:h-9" : "h-10 md:h-12 lg:h-14"
                  )}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className={cn(
              "hidden lg:flex items-center justify-center transition-all duration-500",
              scrolled ? "mx-4" : "absolute left-1/2 -translate-x-1/2"
            )}>
              <ul className="flex items-center gap-1">
                {navItems.map((item) => (
                  <li key={item.href} className="relative">
                    <Link
                      to={item.href}
                      className={cn(
                        "relative text-sm font-medium rounded-full transition-all duration-300 ease-out overflow-hidden",
                        scrolled ? "px-3 py-1.5" : "px-4 py-2",
                        isActive(item.href, item.sectionId) 
                          ? "text-background" 
                          : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                      )}
                    >
                      {/* Animated background pill */}
                      <motion.span
                        className="absolute inset-0 bg-foreground rounded-full"
                        initial={false}
                        animate={{
                          scale: isActive(item.href, item.sectionId) ? 1 : 0,
                          opacity: isActive(item.href, item.sectionId) ? 1 : 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Side */}
            <div className={cn(
              "flex items-center flex-shrink-0 transition-all duration-500",
              scrolled ? "gap-0.5 pr-1" : "gap-2"
            )}>
              {/* Search */}
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "flex items-center justify-center rounded-full transition-all duration-200",
                  "text-foreground/60 hover:text-foreground hover:bg-foreground/5",
                  scrolled ? "w-8 h-8" : "w-10 h-10"
                )}
                aria-label="Поиск (⌘K)"
              >
                <Search className={cn("transition-all duration-300", scrolled ? "w-4 h-4" : "w-5 h-5")} />
              </motion.button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* CTA - Desktop */}
              <Link to="/contact" className="hidden md:block">
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className={cn(
                    "rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
                    "bg-foreground text-background hover:bg-foreground/90",
                    scrolled ? "px-3 py-1.5" : "px-5 py-2.5"
                  )}
                >
                  <span className={scrolled ? "hidden xl:inline" : ""}>Обсудить проект</span>
                  <ArrowRight className={cn("transition-all", scrolled ? "w-3.5 h-3.5" : "w-4 h-4")} />
                </motion.button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  "lg:hidden flex items-center justify-center rounded-full transition-colors duration-200",
                  "text-foreground hover:text-foreground hover:bg-foreground/10",
                  "bg-foreground/5",
                  scrolled ? "w-9 h-9" : "w-11 h-11"
                )}
                aria-label="Открыть меню"
              >
                <Menu className={cn("transition-all", scrolled ? "w-5 h-5" : "w-6 h-6")} />
              </button>
            </div>
          </motion.nav>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Panel - slide from RIGHT */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-[85vw] max-w-[320px] z-[101] bg-background border-l border-border/20 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/20">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <img src={currentLogo} alt="Neeklo Studio" loading="lazy" decoding="async" className="h-10" />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Закрыть меню"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Nav - using burgerMenuItems for full navigation */}
              <nav className="flex-1 overflow-y-auto py-4">
                <motion.ul 
                  className="space-y-1 px-3"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.15,
                      }
                    }
                  }}
                >
                  {burgerMenuItems.map((item) => (
                    <motion.li
                      key={item.href}
                      variants={{
                        hidden: { opacity: 0, x: -30, filter: "blur(4px)" },
                        visible: { 
                          opacity: 1, 
                          x: 0, 
                          filter: "blur(0px)",
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }
                        }
                      }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "block px-4 py-3 rounded-xl min-h-[48px] flex items-center",
                          "text-base font-medium transition-all duration-200",
                          location.pathname === item.href
                            ? "bg-foreground text-background"
                            : "text-foreground hover:bg-foreground/5 active:scale-[0.98]"
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>

              {/* CTA */}
              <div className="p-4 border-t border-border/20">
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full min-h-[48px]",
                    "bg-foreground text-background font-medium",
                    "transition-all duration-200 hover:bg-foreground/90"
                  )}
                >
                  <span>Обсудить проект</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
