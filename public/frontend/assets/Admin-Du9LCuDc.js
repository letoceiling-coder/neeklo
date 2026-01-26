import{j as e,m as s}from"./motion-vendor-BDjNjK_3.js";import{r as n}from"./react-vendor-BPADj-9C.js";import{F as c}from"./products-BtLrzWUU.js";import{O as d,ab as l,an as x,ap as p,aq as m,a9 as u,f as g,ar as b}from"./ui-vendor-BGpQ7DQh.js";const r=`# NEEKLO STUDIO — Полная документация проекта

## 📋 Обзор проекта

**Название:** Neeklo Studio
**Тип:** Digital-студия / Агентство
**Язык:** Русский (RU)
**URL:** neeklo.studio

### Технологический стек
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + CSS Variables (HSL)
- **Animations:** Framer Motion
- **State:** React Query (TanStack)
- **Routing:** React Router DOM v6
- **Backend:** Laravel 11 + MySQL
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React

---

## 🎨 Дизайн-система

### Цветовая палитра (HSL формат)

\`\`\`css
/* Фоны */
--background: 0 0% 4%;           /* #0a0a0a - основной фон */
--background-secondary: 0 0% 8%; /* #141414 */
--surface: 0 0% 10%;             /* #1a1a1a - карточки */
--surface-elevated: 0 0% 12%;

/* Текст */
--foreground: 0 0% 100%;         /* белый */
--foreground-muted: 0 0% 63%;    /* серый */
--muted-foreground: 0 0% 63%;

/* Primary (Cyan Neon) */
--primary: 191 100% 50%;         /* #00d4ff */
--primary-hover: 191 100% 55%;
--primary-glow: 191 100% 60%;

/* Secondary (Purple) */
--secondary: 258 90% 66%;        /* #8b5cf6 */

/* Semantic */
--success: 153 100% 50%;         /* #00ff88 */
--warning: 40 100% 50%;          /* #ffaa00 */
--error: 0 100% 63%;             /* #ff4444 */

/* Borders */
--border: 0 0% 100% / 0.1;       /* rgba белый 10% */
--border-hover: 0 0% 100% / 0.2;
\`\`\`

### Типографика

\`\`\`css
/* Шрифты */
font-family: body: Inter, sans-serif
font-family: heading: Poppins, Inter, sans-serif

/* Размеры заголовков */
H1: text-[44px] xl:text-[52px] font-medium tracking-[-0.02em]
H2: text-3xl md:text-4xl font-semibold
H3: text-xl md:text-2xl font-medium
Body: text-[15px] text-muted-foreground/55

/* Mobile */
H1 mobile: text-[22px] sm:text-[26px] font-semibold
\`\`\`

### Отступы (8px сетка)

\`\`\`css
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
--spacing-2xl: 3rem;    /* 48px */
--spacing-3xl: 4rem;    /* 64px */
--spacing-4xl: 6rem;    /* 96px */

/* Секции */
--section-spacing-desktop: 7.5rem; /* 120px */
--section-spacing-mobile: 4rem;    /* 64px */
\`\`\`

### Border Radius

\`\`\`css
--radius: 1rem;      /* 16px - дефолт */
--radius-sm: 0.5rem; /* 8px */
--radius-md: 0.75rem;
--radius-lg: 1rem;
--radius-xl: 1.25rem;
--radius-2xl: 1.5rem;

/* Карточки продуктов */
Desktop: rounded-[28px]
Mobile: rounded-[20px]
\`\`\`

### Эффекты и тени

\`\`\`css
/* Тени */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.4);
--shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);

/* Свечения */
--glow-primary: 0 0 40px hsl(191 100% 50% / 0.4);
--glow-accent: 0 0 30px hsl(191 100% 50% / 0.3);

/* Glass эффект */
bg-white/[0.035] backdrop-blur-3xl border border-white/[0.06]
hover:bg-white/[0.055] hover:border-white/[0.1]
\`\`\`

---

## 📁 Структура проекта

\`\`\`
src/
├── components/
│   ├── common/          # Переиспользуемые компоненты
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── CaseCard.tsx
│   │   ├── Container.tsx
│   │   ├── CookieConsent.tsx
│   │   ├── LazyImage.tsx
│   │   ├── LazyVideo.tsx
│   │   ├── OptimizedImage.tsx
│   │   ├── PageLoader.tsx
│   │   ├── SectionTitle.tsx
│   │   ├── ServiceCard.tsx
│   │   └── VideoPlayer.tsx
│   │
│   ├── hero/            # Hero секция главной
│   │   ├── CanvasHero.tsx      # Обёртка с canvas эффектом
│   │   ├── HeroShowcase.tsx    # Основной контент hero
│   │   ├── SolutionsGrid.tsx   # Сетка продуктов 2x2
│   │   ├── SolutionCard.tsx    # Карточка продукта
│   │   ├── BriefModal.tsx
│   │   └── BriefWizard.tsx
│   │
│   ├── layout/          # Layout компоненты
│   │   ├── MainNav.tsx         # Десктоп навигация
│   │   ├── BottomNav.tsx       # Мобильная нижняя панель
│   │   ├── Footer.tsx
│   │   └── PageTransition.tsx
│   │
│   ├── product/         # Компоненты продуктовых страниц
│   │   ├── ProductPageTemplate.tsx  # Шаблон продуктовой страницы
│   │   ├── ProductHeroMinimal.tsx
│   │   ├── ProblemSolution.tsx
│   │   ├── FeatureAccordion.tsx
│   │   ├── PricingPackages.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── ProductFAQ.tsx
│   │   ├── ProductCTAForm.tsx
│   │   └── mockups/            # Визуальные мокапы
│   │       ├── WebsiteMockup.tsx
│   │       ├── BotMockup.tsx
│   │       ├── VideoMockup.tsx
│   │       └── ...
│   │
│   ├── sections/        # Секции страниц
│   │   ├── TaskAIWizard.tsx    # AI-подбор решений
│   │   ├── VideoProcessSection.tsx
│   │   ├── FeaturedWork.tsx
│   │   ├── PricingSection.tsx
│   │   ├── FAQ.tsx
│   │   ├── ContactFormSection.tsx
│   │   ├── CTA.tsx
│   │   ├── CaseGallery.tsx
│   │   └── ...
│   │
│   └── ui/              # shadcn/ui компоненты
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── accordion.tsx
│       └── ...
│
├── pages/
│   ├── Index.tsx        # Главная страница
│   ├── Products.tsx     # Каталог продуктов
│   ├── Work.tsx         # Кейсы (список)
│   ├── WorkDetail.tsx   # Детальная страница кейса
│   ├── Cases.tsx        # Альтернативный вид кейсов
│   ├── Process.tsx      # Процесс работы
│   ├── About.tsx        # О нас
│   ├── Contact.tsx      # Контакты
│   ├── Privacy.tsx      # Политика конфиденциальности
│   ├── Terms.tsx        # Условия использования
│   ├── Offer.tsx        # Публичная оферта
│   ├── Admin.tsx        # Документация (эта страница)
│   └── products/        # Продуктовые страницы
│       ├── Website.tsx
│       ├── TelegramBot.tsx
│       ├── AIAgent.tsx
│       ├── AIVideo.tsx
│       ├── MiniApp.tsx
│       ├── Automation.tsx
│       ├── Ecosystem.tsx
│       ├── Branding.tsx
│       ├── CRM.tsx
│       ├── MobileApp.tsx
│       ├── Support.tsx
│       └── Consulting.tsx
│
├── data/                # JSON данные
│   ├── products.json    # Список продуктов
│   ├── services.json    # Услуги по категориям
│   ├── cases.json       # Кейсы/портфолио
│   ├── testimonials.json
│   └── team.json
│
├── hooks/               # Кастомные хуки
│   ├── useMetaTags.ts
│   ├── useMobile.ts
│   ├── useScrollAnimation.ts
│   ├── useIntersectionObserver.ts
│   └── ...
│
├── lib/                 # Утилиты
│   ├── utils.ts         # cn() и другие хелперы
│   └── validations/
│
├── styles/
│   └── animations.css
│
├── index.css            # Глобальные стили + CSS переменные
├── App.tsx              # Роутинг и провайдеры
└── main.tsx             # Entry point
\`\`\`

---

## 🛣️ Маршрутизация

\`\`\`typescript
// Основные страницы
"/"                    → Index.tsx (Главная)
"/products"            → Products.tsx (Каталог)
"/work"                → Work.tsx (Кейсы)
"/work/:slug"          → WorkDetail.tsx (Детали кейса)
"/cases"               → Cases.tsx
"/process"             → Process.tsx
"/about"               → About.tsx
"/contact"             → Contact.tsx
"/admin"               → Admin.tsx (Документация)

// Юридические
"/privacy"             → Privacy.tsx
"/terms"               → Terms.tsx
"/offer"               → Offer.tsx
"/consent"             → Consent.tsx

// Продуктовые страницы
"/products/website"      → Website.tsx
"/products/telegram-bot" → TelegramBot.tsx
"/products/ai-agent"     → AIAgent.tsx
"/products/ai-video"     → AIVideo.tsx
"/products/mini-app"     → MiniApp.tsx
"/products/automation"   → Automation.tsx
"/products/ecosystem"    → Ecosystem.tsx
"/products/branding"     → Branding.tsx
"/products/crm"          → CRM.tsx
"/products/mobile-app"   → MobileApp.tsx
"/products/support"      → Support.tsx
"/products/consulting"   → Consulting.tsx

// Catch-all
"*"                    → NotFound.tsx
\`\`\`

---

## 🧩 Ключевые компоненты

### Hero (Главная страница)

\`\`\`typescript
// CanvasHero.tsx - обёртка
<section className="relative w-full min-h-[100svh] flex flex-col">
  {/* Ambient gradients */}
  {/* Canvas эффект (opacity-10 lg:opacity-15) */}
  <HeroShowcase />
</section>

// HeroShowcase.tsx - контент
// Mobile: вертикальный layout, центрирование
// Desktop: 12-колоночная сетка (7 + 5)
<div className="hidden lg:grid lg:grid-cols-12">
  <div className="col-span-7">  {/* Текст + CTA */}
  <div className="col-span-5">  {/* Сетка продуктов */}
</div>

// SolutionsGrid.tsx - сетка 2x2
// SolutionCard.tsx - карточка продукта с glass эффектом
\`\`\`

### Продуктовая страница (шаблон)

\`\`\`typescript
// ProductPageTemplate.tsx
<main>
  <ProductHeroMinimal />     {/* Hero с мокапом */}
  <ProblemSolution />        {/* Проблема → Решение */}
  <FeatureAccordion />       {/* Аккордеон фич */}
  <PricingPackages />        {/* Пакеты цен */}
  <HowItWorks />             {/* Этапы работы */}
  <CompactCases />           {/* Релевантные кейсы */}
  <ProductFAQ />             {/* FAQ */}
  <ProductCTAForm />         {/* Форма заявки */}
</main>
\`\`\`

### Навигация

\`\`\`typescript
// MainNav.tsx (Desktop)
// - Фиксированная сверху
// - Blur эффект при скролле
// - Dropdown для "Продукты"

// BottomNav.tsx (Mobile)
// - Фиксированная снизу
// - 5 иконок: Home, Products, Cases, Process, Menu
// - Glass эффект

// MobileMenu.tsx
// - Полноэкранное меню
// - Анимация появления
\`\`\`

---

## 📊 Данные (JSON)

### products.json
\`\`\`json
[
  {
    "id": 1,
    "title": "AI-агент под ключ",
    "description": "...",
    "accentColor": "blue",
    "ctaText": "Узнать больше",
    "ctaLink": "/products/ai-agent",
    "position": 1
  }
]
\`\`\`

### services.json
\`\`\`json
{
  "categories": [
    { "id": "development", "name": "Разработка", "order": 1 },
    { "id": "ai", "name": "AI", "order": 2 },
    { "id": "design", "name": "Дизайн", "order": 3 }
  ],
  "services": [
    {
      "id": "web-sites",
      "slug": "web-sites",
      "title": "Веб-сайты и лендинги",
      "icon": "globe",
      "category": "development",
      "price": "от 80 000 ₽",
      "problem": "...",
      "solution": ["...", "..."],
      "formats": "..."
    }
  ]
}
\`\`\`

### cases.json
\`\`\`json
[
  {
    "id": "case-slug",
    "title": "Название кейса",
    "client": "Клиент",
    "category": "website",
    "coverImage": "/src/assets/cases/cover.jpg",
    "tags": ["React", "AI"],
    "metrics": {
      "conversions": "+45%",
      "speed": "2.5s"
    }
  }
]
\`\`\`

---

## 🎭 Анимации (Framer Motion)

### Стандартные паттерны

\`\`\`typescript
// Fade in + slide up
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}

// Hover lift (desktop cards)
whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
whileTap={{ scale: 0.97 }}

// Stagger children
transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}

// Easing
ease: [0.25, 0.46, 0.45, 0.94]  // smooth
ease: [0.16, 1, 0.3, 1]        // premium
\`\`\`

### Scroll анимации

\`\`\`typescript
// useInView hook
const ref = useRef(null);
const isInView = useInView(ref, { once: true, margin: "-100px" });

// Scroll indicator
animate={{ y: [0, 4, 0] }}
transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
\`\`\`

---

## 🔌 Интеграции

### Supabase

\`\`\`typescript
import { supabase } from "@/integrations/supabase/client";

// Таблицы:
// - brief_submissions (заявки)

// Edge Functions:
// - send-telegram (отправка в TG)
// - generate-brief (AI генерация брифа)
// - task-wizard-ai (AI подбор решений)
\`\`\`

### Формы

\`\`\`typescript
// BriefForm.tsx - основная форма заявки
// Поля: name, email, phone, company, role, description
// Валидация: Zod
// Отправка: Supabase + Telegram
\`\`\`

---

## 📱 Адаптивность

### Breakpoints

\`\`\`css
xs: 360px   /* iPhone SE */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Small laptop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
\`\`\`

### Паттерны

\`\`\`typescript
// Mobile-first
className="text-sm md:text-base lg:text-lg"

// Скрытие/показ
className="hidden lg:block"     // только desktop
className="lg:hidden"           // только mobile

// Сетки
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Padding
className="px-4 md:px-8 lg:px-16"
\`\`\`

---

## ⚡ Производительность

### Оптимизации
- Lazy loading страниц (React.lazy)
- Code splitting (manualChunks в Vite)
- Оптимизированные изображения (LazyImage, OptimizedImage)
- PWA с Service Worker
- Prefetch критических маршрутов

### PWA конфигурация
\`\`\`typescript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true
  }
})
\`\`\`

---

## 🔧 Команды разработки

\`\`\`bash
# Локальный запуск
npm run dev

# Сборка
npm run build

# Preview production build
npm run preview

# Линтинг
npm run lint
\`\`\`

---

## 📝 Гайдлайны для LLM

### При изменении стилей:
1. Всегда используй CSS переменные из index.css
2. Не пиши цвета напрямую (text-white, bg-black) — используй токены
3. Все цвета в HSL формате

### При создании компонентов:
1. Используй memo() для оптимизации
2. Выноси логику в кастомные хуки
3. Максимум 150-200 строк на компонент

### При работе с анимациями:
1. Framer Motion для всех анимаций
2. Используй стандартные easing функции
3. Не забывай про reduced motion

### Именование:
- Компоненты: PascalCase
- Хуки: useHookName
- Файлы компонентов: PascalCase.tsx
- CSS классы: kebab-case или Tailwind

---

## 🚀 Продукты студии

1. **Сайт за 5 дней** — /products/website
2. **Telegram-бот** — /products/telegram-bot  
3. **AI-агент** — /products/ai-agent
4. **AI-видео** — /products/ai-video
5. **Mini App** — /products/mini-app
6. **Автоматизация** — /products/automation
7. **Экосистема 360°** — /products/ecosystem
8. **Брендинг** — /products/branding
9. **CRM** — /products/crm
10. **Мобильное приложение** — /products/mobile-app
11. **Техподдержка** — /products/support
12. **Консалтинг** — /products/consulting

---

*Документация актуальна на: ${new Date().toLocaleDateString("ru-RU")}*
`,h=[{id:"overview",title:"Обзор проекта",icon:d},{id:"design",title:"Дизайн-система",icon:l},{id:"structure",title:"Структура",icon:x},{id:"components",title:"Компоненты",icon:p},{id:"data",title:"Данные",icon:m},{id:"performance",title:"Производительность",icon:u}];function C(){const[i,a]=n.useState(!1),o=async()=>{try{await navigator.clipboard.writeText(r),a(!0),setTimeout(()=>a(!1),2e3)}catch(t){console.error("Failed to copy:",t)}};return e.jsxs(e.Fragment,{children:[e.jsx("main",{className:"min-h-screen bg-background pt-24 pb-16",children:e.jsxs("div",{className:"max-w-5xl mx-auto px-4 md:px-8",children:[e.jsxs(s.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},className:"mb-12",children:[e.jsx("h1",{className:"text-3xl md:text-4xl font-semibold text-foreground mb-4",children:"Документация проекта"}),e.jsx("p",{className:"text-muted-foreground mb-6",children:"Полная техническая документация Neeklo Studio для работы с LLM (ChatGPT, Claude и др.)"}),e.jsx("div",{className:"flex flex-wrap gap-2 mb-8",children:h.map(t=>e.jsxs("div",{className:`flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-white/[0.03] border border-white/[0.06]
                    text-sm text-muted-foreground`,children:[e.jsx(t.icon,{className:"w-3.5 h-3.5 text-primary/60"}),t.title]},t.id))}),e.jsx(s.button,{onClick:o,whileHover:{scale:1.02},whileTap:{scale:.98},className:`flex items-center gap-3 px-6 py-3.5 rounded-2xl
                bg-gradient-to-r from-primary/20 via-primary/10 to-transparent
                border border-primary/30 hover:border-primary/50
                text-foreground font-medium
                transition-all duration-200
                hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)]`,children:i?e.jsxs(e.Fragment,{children:[e.jsx(g,{className:"w-5 h-5 text-green-400"}),e.jsx("span",{className:"text-green-400",children:"Скопировано!"})]}):e.jsxs(e.Fragment,{children:[e.jsx(b,{className:"w-5 h-5"}),e.jsx("span",{children:"Скопировать всю документацию"})]})})]}),e.jsxs(s.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.1},className:"relative",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent rounded-3xl"}),e.jsx("div",{className:`relative p-6 md:p-8 rounded-3xl
                bg-white/[0.02] backdrop-blur-sm
                border border-white/[0.06]`,children:e.jsx("pre",{className:"whitespace-pre-wrap text-sm text-muted-foreground/80 font-mono leading-relaxed overflow-x-auto",children:r})})]}),e.jsxs(s.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.2},className:"mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]",children:[e.jsx("h2",{className:"text-lg font-medium text-foreground mb-4",children:"Как использовать"}),e.jsxs("ol",{className:"space-y-3 text-muted-foreground text-sm",children:[e.jsxs("li",{className:"flex gap-3",children:[e.jsx("span",{className:"flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium",children:"1"}),e.jsx("span",{children:'Нажмите кнопку "Скопировать всю документацию"'})]}),e.jsxs("li",{className:"flex gap-3",children:[e.jsx("span",{className:"flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium",children:"2"}),e.jsx("span",{children:"Откройте ChatGPT или другой LLM"})]}),e.jsxs("li",{className:"flex gap-3",children:[e.jsx("span",{className:"flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium",children:"3"}),e.jsx("span",{children:'Вставьте документацию в начало диалога с пометкой "Это документация проекта"'})]}),e.jsxs("li",{className:"flex gap-3",children:[e.jsx("span",{className:"flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium",children:"4"}),e.jsx("span",{children:"Теперь LLM понимает структуру проекта и может писать точные промты"})]})]})]})]})}),e.jsx(c,{})]})}export{C as default};
