# 📚 Документация структуры проекта для Claude AI

**Версия:** 1.0.0  
**Дата создания:** Январь 2026  
**Назначение:** Справочная документация для работы с проектом через AI промпты

---

## 🎯 Обзор проекта

Проект представляет собой полнофункциональную платформу для Telegram Mini App приложений с двумя фронтендами:

- **Backend:** Laravel 11 (PHP 8.2+)
- **Frontend (Админ-панель):** Vue 3 + TypeScript + Vite
- **Frontend (Пользовательский сайт):** React 18 + TypeScript + Vite

### Технологический стек

**Backend:**
- Laravel 11
- PHP 8.2+
- MySQL/PostgreSQL
- Laravel Sanctum (авторизация)
- Telegram Bot API (через `letoceiling-coder/telegram`)

**Frontend (Админ):**
- Vue 3.5.24
- TypeScript
- Vite 7.0.7
- TailwindCSS 4.0
- Vue Router 4.6.3
- Vuex 4.1.0

**Frontend (Пользовательский):**
- React 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19
- TailwindCSS 3.4.17
- React Router DOM 6.30.1
- Framer Motion 12.23.24
- GSAP 3.13.0
- Three.js 0.181.2
- React Three Fiber 8.18.0
- Spline (@splinetool/react-spline 4.1.0)
- Radix UI компоненты
- React Hook Form 7.66.0
- Zod 4.1.12

---

## 📁 Структура директорий

```
neeklo/
├── app/                          # Laravel Backend
│   ├── Console/                  # Artisan команды
│   │   └── Commands/
│   ├── Http/                     # HTTP слой
│   │   ├── Controllers/          # Контроллеры
│   │   ├── Middleware/           # Middleware
│   │   ├── Requests/             # Валидация запросов
│   │   ├── Resources/            # API Resources
│   │   └── Filters/              # Фильтры для запросов
│   ├── Models/                   # Eloquent модели
│   ├── Services/                 # Бизнес-логика
│   └── Providers/                # Service Providers
│
├── frontend/                     # React Frontend (пользовательский сайт)
│   └── src/
│       ├── components/           # React компоненты
│       ├── pages/                # Страницы приложения
│       ├── hooks/                # React хуки
│       ├── lib/                  # Утилиты и библиотеки
│       ├── data/                 # JSON данные
│       ├── assets/               # Статические ресурсы
│       └── styles/               # Стили
│
├── resources/                    # Vue Frontend (админ-панель)
│   ├── js/
│   │   ├── pages/                # Vue страницы
│   │   ├── components/           # Vue компоненты
│   │   ├── layouts/              # Layout компоненты
│   │   ├── composables/          # Vue composables
│   │   └── utils/                # Утилиты
│   ├── views/                    # Blade шаблоны
│   └── css/                      # Стили
│
├── routes/                       # Маршруты
│   ├── api.php                   # API маршруты
│   ├── web.php                   # Web маршруты
│   └── console.php               # Консольные команды
│
├── database/
│   ├── migrations/               # Миграции БД
│   └── seeders/                  # Seeders
│
├── public/                       # Публичная директория
├── config/                       # Конфигурационные файлы
├── storage/                      # Файлы хранилища
└── tests/                        # Тесты
```

---

## 🔧 Backend структура (Laravel)

### Контроллеры (`app/Http/Controllers/`)

#### API Контроллеры (`app/Http/Controllers/Api/`)

**AuthController** (`Api/AuthController.php`)
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/logout` - Выход (требует auth:sanctum)
- `GET /api/auth/user` - Получить текущего пользователя (требует auth:sanctum)
- `POST /api/auth/forgot-password` - Запрос восстановления пароля
- `POST /api/auth/reset-password` - Сброс пароля

**AdminMenuController** (`Api/AdminMenuController.php`)
- `GET /api/admin/menu` - Получить меню админ-панели (требует auth:sanctum)

**NotificationController** (`Api/NotificationController.php`)
- `GET /api/notifications` - Список уведомлений (требует auth:sanctum)
- `GET /api/notifications/all` - Все уведомления (требует auth:sanctum)
- `POST /api/notifications/{id}/read` - Отметить как прочитанное (требует auth:sanctum)
- `DELETE /api/notifications/{id}` - Удалить уведомление (требует auth:sanctum)
- `GET /api/notifications/unread-count` - Количество непрочитанных (требует auth:sanctum)

**RoleController** (`Api/RoleController.php`)
- `GET /api/v1/roles` - Список ролей (требует auth:sanctum + admin)
- `POST /api/v1/roles` - Создать роль (требует auth:sanctum + admin)
- `GET /api/v1/roles/{id}` - Получить роль (требует auth:sanctum + admin)
- `PUT /api/v1/roles/{id}` - Обновить роль (требует auth:sanctum + admin)
- `DELETE /api/v1/roles/{id}` - Удалить роль (требует auth:sanctum + admin)

**UserController** (`Api/UserController.php`)
- `GET /api/v1/users` - Список пользователей (требует auth:sanctum + admin)
- `POST /api/v1/users` - Создать пользователя (требует auth:sanctum + admin)
- `GET /api/v1/users/{id}` - Получить пользователя (требует auth:sanctum + admin)
- `PUT /api/v1/users/{id}` - Обновить пользователя (требует auth:sanctum + admin)
- `DELETE /api/v1/users/{id}` - Удалить пользователя (требует auth:sanctum + admin)

**BotController** (`Api/BotController.php`)
- `GET /api/v1/bots` - Список ботов (требует auth:sanctum + admin)
- `POST /api/v1/bots` - Создать бота (требует auth:sanctum + admin)
- `GET /api/v1/bots/{id}` - Получить бота (требует auth:sanctum + admin)
- `PUT /api/v1/bots/{id}` - Обновить бота (требует auth:sanctum + admin)
- `DELETE /api/v1/bots/{id}` - Удалить бота (требует auth:sanctum + admin)
- `GET /api/v1/bots/{id}/check-webhook` - Проверить webhook бота (требует auth:sanctum + admin)
- `POST /api/v1/bots/{id}/register-webhook` - Зарегистрировать webhook (требует auth:sanctum + admin)
- `POST /api/telegram/webhook/{id}` - Обработка webhook от Telegram (публичный)

**SupportController** (`Api/SupportController.php`)
- `GET /api/v1/support/tickets` - Список тикетов (требует auth:sanctum + admin)
- `GET /api/v1/support/tickets/{id}` - Получить тикет (требует auth:sanctum + admin)
- `POST /api/v1/support/ticket` - Создать тикет (требует auth:sanctum + admin)
- `POST /api/v1/support/message` - Отправить сообщение в тикет (требует auth:sanctum + admin)
- `POST /api/support/webhook/message` - Webhook для получения сообщений (требует deploy.token)
- `POST /api/support/webhook/status` - Webhook для изменения статуса (требует deploy.token)

**FolderController** (`Api/v1/FolderController.php`)
- `GET /api/v1/folders` - Список папок (требует auth:sanctum)
- `POST /api/v1/folders` - Создать папку (требует auth:sanctum)
- `GET /api/v1/folders/{id}` - Получить папку (требует auth:sanctum)
- `PUT /api/v1/folders/{id}` - Обновить папку (требует auth:sanctum)
- `DELETE /api/v1/folders/{id}` - Удалить папку (требует auth:sanctum)
- `GET /api/v1/folders/tree/all` - Получить дерево папок (требует auth:sanctum)
- `POST /api/v1/folders/update-positions` - Обновить позиции папок (требует auth:sanctum)
- `POST /api/v1/folders/{id}/restore` - Восстановить папку (требует auth:sanctum)

**MediaController** (`Api/v1/MediaController.php`)
- `GET /api/v1/media` - Список медиа-файлов (требует auth:sanctum)
- `POST /api/v1/media` - Загрузить файл (требует auth:sanctum)
- `GET /api/v1/media/{id}` - Получить медиа-файл (требует auth:sanctum)
- `PUT /api/v1/media/{id}` - Обновить медиа-файл (требует auth:sanctum)
- `DELETE /api/v1/media/{id}` - Удалить медиа-файл (требует auth:sanctum)
- `POST /api/v1/media/{id}/restore` - Восстановить файл (требует auth:sanctum)
- `DELETE /api/v1/media/trash/empty` - Очистить корзину (требует auth:sanctum)

**DeployController** (`Api/DeployController.php`)
- `POST /api/deploy` - Выполнить деплой (требует deploy.token)
- `POST /api/seed` - Выполнить seeders (требует deploy.token)

**IntegrationController** (`Api/IntegrationController.php`)
- `POST /api/integration/messages` - Получить сообщение от внешней системы (требует deploy.token)
- `POST /api/integration/status` - Получить изменение статуса (требует deploy.token)

**WebhookController** (`Api/WebhookController.php`)
- `POST /api/webhook/github` - Webhook от GitHub для деплоя (публичный, проверка подписи внутри)

**SubscriptionCheckController** (`Api/SubscriptionCheckController.php`)
- `GET /api/subscription/check` - Проверить подписку (публичный)

**BriefSubmissionController** (`Api/BriefSubmissionController.php`)
- `POST /api/brief-submissions` - Создать заявку на бриф (публичный)
- `POST /api/brief-submissions/upload-files` - Загрузить файлы для бриф-заявки (публичный)
- `POST /api/brief-submissions/send-telegram` - Отправить сообщение в Telegram (публичный)

**LogController** (`LogController.php`)
- `GET /api/logs` - Получить логи (публичный)
- `GET /api/logs/files` - Список файлов логов (публичный)
- `POST /api/logs/clear` - Очистить логи (публичный)

#### Middleware (`app/Http/Middleware/`)

**CheckSubscription** (`Middleware/CheckSubscription.php`)
- Проверяет активность подписки пользователя
- Используется для защиты маршрутов, требующих активной подписки

**EnsureUserIsAdmin** (`Middleware/EnsureUserIsAdmin.php`)
- Проверяет, что пользователь имеет роль `admin`
- Алиас: `admin`
- Используется для защиты админских маршрутов

**ForceHttps** (`Middleware/ForceHttps.php`)
- Принудительно перенаправляет на HTTPS в production

**VerifyDeployToken** (`Middleware/VerifyDeployToken.php`)
- Проверяет токен деплоя из заголовка `X-Deploy-Token`
- Алиас: `deploy.token`
- Используется для защиты webhook'ов и деплоя

### Модели (`app/Models/`)

**User** (`Models/User.php`)
- Основная модель пользователя
- Связи: `roles` (many-to-many), `notifications` (hasMany), `folders` (hasMany), `media` (hasMany)
- Трейты: `HasApiTokens` (Sanctum), `HasUserScope`
- Scopes: `UserScope`

**Role** (`Models/Role.php`)
- Модель ролей (admin, manager, user)
- Связи: `users` (many-to-many)

**Folder** (`Models/Folder.php`)
- Модель папок медиа-библиотеки
- Поддержка древовидной структуры (parent_id)
- Soft deletes
- Связи: `parent`, `children`, `user`, `media`
- Трейты: `Filterable`

**Media** (`Models/Media.php`)
- Модель медиа-файлов
- Soft deletes
- Связи: `folder`, `user`
- Трейты: `Filterable`

**Notification** (`Models/Notification.php`)
- Модель уведомлений
- Связи: `user` (belongsTo)

**SupportTicket** (`Models/SupportTicket.php`)
- Модель тикетов поддержки
- Связи: `messages` (hasMany), `user` (belongsTo)
- Поля: `title`, `status`, `external_id`, `external_url`

**SupportMessage** (`Models/SupportMessage.php`)
- Модель сообщений в тикетах
- Связи: `ticket` (belongsTo), `user` (belongsTo)
- Поля: `body`, `is_from_external`, `external_id`

**Bot** (`Models/Bot.php`)
- Модель Telegram ботов
- Поля: `name`, `token`, `webhook_url`, `is_active`

**BriefSubmission** (`Models/BriefSubmission.php`)
- Модель заявок на бриф
- Поля: `name`, `email`, `phone`, `company`, `project_type`, `budget`, `deadline`, `description`, `files`

**PersonalAccessToken** (`Models/PersonalAccessToken.php`)
- Модель токенов Sanctum (расширенная)

### Сервисы (`app/Services/`)

**AdminMenu** (`Services/AdminMenu.php`)
- Генерация меню админ-панели на основе ролей пользователя
- Метод: `getMenuForUser(User $user)`

**SubscriptionService** (`Services/SubscriptionService.php`)
- Проверка статуса подписки через внешний API
- Кеширование результатов
- Методы: `checkSubscription($userId)`, `isSubscriptionActive($userId)`

**SupportService** (`Services/SupportService.php`)
- Бизнес-логика работы с тикетами поддержки
- Интеграция с внешними CRM системами
- Методы: `createTicket()`, `sendMessage()`, `updateStatus()`

**TelegramService** (`Services/TelegramService.php`)
- Работа с Telegram Bot API
- Валидация initData
- Методы для отправки сообщений

**NotificationTool** (`Services/NotificationTool.php`)
- Создание и отправка уведомлений пользователям
- Методы: `create()`, `send()`

**SupportLogger** (`Services/SupportLogger.php`)
- Логирование операций с поддержкой

**IntegrationService** (`Services/Integration/IntegrationService.php`)
- Обработка интеграций с внешними системами
- Получение сообщений и статусов через webhook'и

### Artisan команды (`app/Console/Commands/`)

**CreateUser** (`Commands/CreateUser.php`)
- Создание пользователя через консоль
- Использование: `php artisan user:create`

**Deploy** (`Commands/Deploy.php`)
- Выполнение деплоя через консоль
- Использование: `php artisan deploy`

**FixBotWebhookUrls** (`Commands/FixBotWebhookUrls.php`)
- Исправление URL webhook'ов для ботов

**LogReset** (`Commands/LogReset.php`)
- Очистка логов

**ServerSeed** (`Commands/ServerSeed.php`)
- Выполнение seeders на сервере

### Валидация запросов (`app/Http/Requests/`)

**CreateTicketRequest** - Валидация создания тикета
**SendMessageRequest** - Валидация отправки сообщения
**StoreFolderRequest** - Валидация создания папки
**StoreMediaRequest** - Валидация загрузки медиа
**UpdateFolderRequest** - Валидация обновления папки
**WebhookMessageRequest** - Валидация webhook сообщения
**WebhookStatusRequest** - Валидация webhook статуса

### Фильтры (`app/Http/Filters/`)

**FolderFilter** - Фильтрация папок по различным параметрам
**AbstractFilter** - Базовый класс для фильтров
**FilterInterface** - Интерфейс фильтров

### API Resources (`app/Http/Resources/`)

**FolderResource** - Форматирование данных папки для API
**MediaResource** - Форматирование данных медиа для API

---

## 🎨 Frontend структура (Vue - Админ-панель)

### Основные файлы

**Точка входа:** `resources/js/admin.js`
**Главный компонент:** `resources/js/App.vue`
**Layout:** `resources/js/layouts/AdminLayout.vue`

### Страницы (`resources/js/pages/admin/`)

**Dashboard.vue** - Главная страница админ-панели
**Users.vue** - Управление пользователями
**Roles.vue** - Управление ролями
**Media.vue** - Медиа-библиотека
**Notifications.vue** - Уведомления
**Support.vue** - Список тикетов поддержки
**SupportTicket.vue** - Детали тикета поддержки
**Bots.vue** - Управление ботами
**Products.vue** - Управление продуктами
**Services.vue** - Управление услугами
**Categories.vue** - Управление категориями
**Settings.vue** - Настройки
**Subscription.vue** - Информация о подписке
**Documentation.vue** - Документация
**Versions.vue** - Версии проекта
**ImageEditor.vue** - Редактор изображений

### Компоненты (`resources/js/components/admin/`)

**Header.vue** - Шапка админ-панели
**Sidebar.vue** - Боковое меню
**NotificationDropdown.vue** - Выпадающий список уведомлений
**StatusBadge.vue** - Бейдж статуса
**SubscriptionInfo.vue** - Информация о подписке
**TicketChat.vue** - Чат тикета поддержки

### Страницы авторизации (`resources/js/pages/auth/`)

**Login.vue** - Страница входа
**Register.vue** - Страница регистрации
**ForgotPassword.vue** - Восстановление пароля
**ResetPassword.vue** - Сброс пароля

### Утилиты (`resources/js/utils/`)

**api.js** - API клиент для работы с бэкендом
- `API_BASE = '/api/v1'` (уже содержит префикс)
- Функции: `apiGet()`, `apiPost()`, `apiPut()`, `apiDelete()`
- **ВАЖНО:** Не добавлять `/v1/` или `/api/v1/` в пути - это приведет к дублированию

### Composables (`resources/js/composables/`)

**useAuthToken.js** - Работа с токенами авторизации

### Blade шаблоны (`resources/views/`)

**admin.blade.php** - Шаблон админ-панели
**auth.blade.php** - Шаблон страниц авторизации
**react.blade.php** - Шаблон React приложения
**app.blade.php** - Основной шаблон
**welcome.blade.php** - Приветственная страница

---

## ⚛️ Frontend структура (React - Пользовательский сайт)

### Основные файлы

**Точка входа:** `frontend/src/main.tsx` (предположительно)
**Конфигурация:** `frontend/vite.config.ts`
**Стили:** `frontend/src/styles/`

### Страницы (`frontend/src/pages/`)

**Index.tsx** - Главная страница
**About.tsx** - О нас
**Services.tsx** - Услуги
**ServiceDetail.tsx** - Детали услуги
**Products.tsx** - Продукты
**Cases.tsx** - Кейсы
**Work.tsx** - Работы
**WorkDetail.tsx** - Детали работы
**Contact.tsx** - Контакты
**Process.tsx** - Процесс работы
**Privacy.tsx** - Политика конфиденциальности
**Terms.tsx** - Условия использования
**Offer.tsx** - Оферта
**Consent.tsx** - Согласие на обработку данных
**NotFound.tsx** - 404 страница
**Admin.tsx** - Админ-страница (если есть)

### Страницы продуктов (`frontend/src/pages/products/`)

**AIAgent.tsx** - AI Агент
**AIVideo.tsx** - AI Видео
**Automation.tsx** - Автоматизация
**Branding.tsx** - Брендинг
**Consulting.tsx** - Консалтинг
**CRM.tsx** - CRM система
**Ecosystem.tsx** - Экосистема
**MiniApp.tsx** - Telegram Mini App
**MobileApp.tsx** - Мобильное приложение
**Support.tsx** - Поддержка
**TelegramBot.tsx** - Telegram бот
**Website.tsx** - Веб-сайт

### Компоненты (`frontend/src/components/`)

#### Общие компоненты (`components/common/`)

**Button.tsx** - Кнопка
**Card.tsx** - Карточка
**Container.tsx** - Контейнер
**SectionTitle.tsx** - Заголовок секции
**Breadcrumbs.tsx** - Хлебные крошки
**ErrorBoundary.tsx** - Обработка ошибок
**PageLoader.tsx** - Загрузчик страницы
**PageSkeleton.tsx** - Скелетон страницы
**ScrollToTop.tsx** - Прокрутка наверх
**ThemeToggle.tsx** - Переключатель темы
**CookieConsent.tsx** - Согласие на cookies
**CustomCursor.tsx** - Кастомный курсор
**LazyImage.tsx** - Ленивая загрузка изображений
**LazySection.tsx** - Ленивая загрузка секций
**LazyVideo.tsx** - Ленивая загрузка видео
**OptimizedImage.tsx** - Оптимизированное изображение
**ResponsiveImage.tsx** - Адаптивное изображение
**ParallaxBackground.tsx** - Параллакс фон
**VideoPlayer.tsx** - Видео плеер
**StructuredData.tsx** - Структурированные данные
**ServiceCard.tsx** - Карточка услуги
**CaseCard.tsx** - Карточка кейса
**TestimonialCard.tsx** - Карточка отзыва
**Skeletons.tsx** - Скелетоны загрузки
**QuickOrderForm.tsx** - Форма быстрого заказа

#### Hero компоненты (`components/hero/`)

**HeroSection.tsx** - Основная секция hero
**HeroContent.tsx** - Контент hero
**HeroInput.tsx** - Поле ввода hero
**PremiumHeroInput.tsx** - Премиум поле ввода
**HeroMetrics.tsx** - Метрики hero
**HeroShowcase.tsx** - Витрина hero
**HeroVideo.tsx** - Видео hero
**AnimatedBackground.tsx** - Анимированный фон
**CanvasHero.tsx** - Canvas hero
**SplineBackground.tsx** - Spline фон
**BriefModal.tsx** - Модальное окно бриф-формы
**BriefWizard.tsx** - Мастер бриф-формы
**SolutionCard.tsx** - Карточка решения
**SolutionsGrid.tsx** - Сетка решений

#### Layout компоненты (`components/layout/`)

**MainNav.tsx** - Главная навигация
**Footer.tsx** - Футер
**BottomNav.tsx** - Нижняя навигация
**PageTransition.tsx** - Переходы между страницами
**StickyCtaButton.tsx** - Липкая кнопка CTA

#### Product компоненты (`components/product/`)

**ProductPageTemplate.tsx** - Шаблон страницы продукта
**ProductPageCompactTemplate.tsx** - Компактный шаблон
**ProductHeroCompact.tsx** - Компактный hero продукта
**ProductHeroMinimal.tsx** - Минималистичный hero
**ProductPackagesCompact.tsx** - Компактные пакеты
**PricingPackages.tsx** - Пакеты цен
**PackageConfigurator.tsx** - Конфигуратор пакетов
**ProductCTAForm.tsx** - Форма CTA продукта
**ProductFAQ.tsx** - FAQ продукта
**ProductExamples.tsx** - Примеры продукта
**CaseExamples.tsx** - Примеры кейсов
**CompactCases.tsx** - Компактные кейсы
**FeatureAccordion.tsx** - Аккордеон функций
**HowItWorks.tsx** - Как это работает
**HowToOrder.tsx** - Как заказать
**ProblemSolution.tsx** - Проблема-решение
**AudienceCards.tsx** - Карточки аудитории
**ChatMockup.tsx** - Мокап чата
**StatsCounter.tsx** - Счетчик статистики
**StickyCTA.tsx** - Липкий CTA
**ProductWizard.tsx** - Мастер продукта

#### Mockups (`components/product/mockups/`)

**BotMockup.tsx** - Мокап бота
**MiniAppMockup.tsx** - Мокап Mini App
**MobileMockup.tsx** - Мокап мобильного приложения
**WebsiteMockup.tsx** - Мокап веб-сайта
**CRMMockup.tsx** - Мокап CRM
**AutomationMockup.tsx** - Мокап автоматизации
**BrandingMockup.tsx** - Мокап брендинга
**ConsultingMockup.tsx** - Мокап консалтинга
**EcosystemMockup.tsx** - Мокап экосистемы
**SupportMockup.tsx** - Мокап поддержки
**VideoMockup.tsx** - Мокап видео

#### Section компоненты (`components/sections/`)

**Approach.tsx** - Подход
**BriefFormSection.tsx** - Секция формы бриф
**CaseGallery.tsx** - Галерея кейсов
**CaseHero.tsx** - Hero кейса
**CaseMediaGallery.tsx** - Медиа галерея кейса
**CaseMetrics.tsx** - Метрики кейса
**CaseNavigation.tsx** - Навигация кейсов
**CaseStory.tsx** - История кейса
**CaseSummary.tsx** - Резюме кейса
**CaseTestimonial.tsx** - Отзыв кейса
**ContactFormSection.tsx** - Секция формы контактов
**CTA.tsx** - Call to Action
**CTAForm.tsx** - Форма CTA
**DirectionsSection.tsx** - Секция направлений
**FAQ.tsx** - Часто задаваемые вопросы
**FeaturedWork.tsx** - Избранные работы
**InteractiveProcess.tsx** - Интерактивный процесс
**NewsSection.tsx** - Секция новостей
**PricingSection.tsx** - Секция цен
**ProcessSticky.tsx** - Липкий процесс
**ProcessTimeline.tsx** - Временная линия процесса
**ProductFilters.tsx** - Фильтры продуктов
**Products.tsx** - Продукты
**ProofStrip.tsx** - Полоса доказательств
**ReadySolutions.tsx** - Готовые решения
**ScrootieHelper.tsx** - Помощник Scrootie
**ServiceGrid.tsx** - Сетка услуг
**ServicesHolo.tsx** - Услуги Holo
**ServicesTeaser.tsx** - Тизер услуг
**SkruticSelector.tsx** - Селектор Skrutic
**SyntheticHero.tsx** - Синтетический hero
**TaskAIWizard.tsx** - Мастер Task AI
**TechStack.tsx** - Технологический стек
**Testimonials.tsx** - Отзывы
**VideoCasesSlider.tsx** - Слайдер видео кейсов
**VideoProcessSection.tsx** - Секция видео процесса

#### UI компоненты (`components/ui/`)

Компоненты на основе Radix UI (17 файлов):
- Accordion, Alert Dialog, Avatar, Button, Card, Checkbox, Dialog, Dropdown Menu, Input, Label, Popover, Progress, Radio Group, Select, Separator, Slider, Tabs, Toast, Toggle, Tooltip и другие

#### Другие компоненты

**BriefForm.tsx** - Форма бриф-заявки
**FileUpload.tsx** - Загрузка файлов
**SuccessModal.tsx** - Модальное окно успеха
**NavLink.tsx** - Навигационная ссылка

### Хуки (`frontend/src/hooks/`)

**useActiveSection.ts** - Активная секция
**useAutoResizeTextarea.ts** - Автоматическое изменение размера textarea
**useDebounce.ts** - Дебаунс
**useIntersectionObserver.ts** - Intersection Observer
**useLazyImage.ts** - Ленивая загрузка изображений
**useMetaTags.ts** - Мета-теги
**useMobile.ts** - Определение мобильного устройства
**use-mobile.tsx** - Альтернативный хук для мобильных
**useParallax.ts** - Параллакс эффект
**usePrefersReducedMotion.ts** - Предпочтения движения
**usePreloadImages.ts** - Предзагрузка изображений
**usePreloadRoutes.ts** - Предзагрузка маршрутов
**useScrollAnimation.ts** - Анимация при скролле
**useScrollAnimations.ts** - Анимации скролла (множественное)
**useScrollDirection.ts** - Направление скролла
**useSpeechRecognition.ts** - Распознавание речи
**useTheme.ts** - Тема приложения
**useToast.ts** - Уведомления (toast)
**useWebVitals.ts** - Web Vitals метрики

### Утилиты (`frontend/src/lib/`)

**api.ts** - API клиент для работы с бэкендом
**utils.ts** - Общие утилиты
**performance.ts** - Утилиты производительности
**validations/briefForm.ts** - Валидация формы бриф

### Данные (`frontend/src/data/`)

**awards.json** - Награды
**cases.json** - Кейсы
**logos.json** - Логотипы
**productPages.json** - Страницы продуктов
**products.json** - Продукты
**services.json** - Услуги
**stack.json** - Технологический стек
**team.json** - Команда
**testimonials.json** - Отзывы

### Ресурсы (`frontend/src/assets/`)

**logo.png** - Логотип
**logo-dark.png** - Логотип (темная тема)
**about-hero.png** - Hero изображение "О нас"
**cases/** - Изображения кейсов

---

## 🗄️ База данных

### Основные таблицы

**users**
- `id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `last_notification_sent_at`, `created_at`, `updated_at`

**roles**
- `id`, `name`, `created_at`, `updated_at`

**role_user** (pivot)
- `role_id`, `user_id`

**folders**
- `id`, `name`, `parent_id`, `user_id`, `position`, `protected`, `deleted_at`, `created_at`, `updated_at`

**media**
- `id`, `name`, `path`, `type`, `size`, `folder_id`, `original_folder_id`, `user_id`, `deleted_at`, `created_at`, `updated_at`

**notifications**
- `id`, `user_id`, `title`, `message`, `read_at`, `created_at`, `updated_at`

**support_tickets**
- `id`, `user_id`, `title`, `status`, `external_id`, `external_url`, `created_at`, `updated_at`

**support_messages**
- `id`, `ticket_id`, `user_id`, `body`, `is_from_external`, `external_id`, `created_at`, `updated_at`

**bots**
- `id`, `name`, `token`, `webhook_url`, `is_active`, `created_at`, `updated_at`

**brief_submissions**
- `id`, `name`, `email`, `phone`, `company`, `project_type`, `budget`, `deadline`, `description`, `files`, `created_at`, `updated_at`

**personal_access_tokens** (Sanctum)
- `id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`

### Миграции (`database/migrations/`)

Все миграции следуют стандартному Laravel формату с префиксом даты.

---

## 🔐 Система авторизации

### Sanctum

Проект использует Laravel Sanctum для API аутентификации.

**Токены:**
- Создаются при входе через `AuthController@login`
- Передаются в заголовке: `Authorization: Bearer {token}`
- Хранятся в таблице `personal_access_tokens`

**Middleware:**
- `auth:sanctum` - проверка токена
- `admin` - проверка роли admin (использует `EnsureUserIsAdmin`)

### Роли

**admin** - Полный доступ ко всем разделам
**manager** - Доступ к Медиа, Уведомлениям, Поддержке, Подписке, Документации
**user** - Доступ только к Документации

---

## 🔗 API Endpoints (полный список)

### Публичные endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/subscription/check
POST   /api/brief-submissions
POST   /api/brief-submissions/upload-files
POST   /api/brief-submissions/send-telegram
GET    /api/logs
GET    /api/logs/files
POST   /api/logs/clear
POST   /api/telegram/webhook/{id}
POST   /api/webhook/github
```

### Защищенные endpoints (требуют auth:sanctum)

```
POST   /api/auth/logout
GET    /api/auth/user
GET    /api/admin/menu
GET    /api/notifications
GET    /api/notifications/all
POST   /api/notifications/{id}/read
DELETE /api/notifications/{id}
GET    /api/notifications/unread-count

# Media API (v1)
GET    /api/v1/folders
POST   /api/v1/folders
GET    /api/v1/folders/{id}
PUT    /api/v1/folders/{id}
DELETE /api/v1/folders/{id}
GET    /api/v1/folders/tree/all
POST   /api/v1/folders/update-positions
POST   /api/v1/folders/{id}/restore

GET    /api/v1/media
POST   /api/v1/media
GET    /api/v1/media/{id}
PUT    /api/v1/media/{id}
DELETE /api/v1/media/{id}
POST   /api/v1/media/{id}/restore
DELETE /api/v1/media/trash/empty
```

### Админские endpoints (требуют auth:sanctum + admin)

```
# Roles
GET    /api/v1/roles
POST   /api/v1/roles
GET    /api/v1/roles/{id}
PUT    /api/v1/roles/{id}
DELETE /api/v1/roles/{id}

# Users
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}
DELETE /api/v1/users/{id}

# Bots
GET    /api/v1/bots
POST   /api/v1/bots
GET    /api/v1/bots/{id}
PUT    /api/v1/bots/{id}
DELETE /api/v1/bots/{id}
GET    /api/v1/bots/{id}/check-webhook
POST   /api/v1/bots/{id}/register-webhook

# Support
GET    /api/v1/support/tickets
GET    /api/v1/support/tickets/{id}
POST   /api/v1/support/ticket
POST   /api/v1/support/message
```

### Webhook endpoints (требуют deploy.token)

```
POST   /api/deploy
POST   /api/seed
POST   /api/integration/messages
POST   /api/integration/status
POST   /api/support/webhook/message (legacy)
POST   /api/support/webhook/status (legacy)
```

---

## 🚀 Сборка и деплой

### Команды сборки

**Root package.json:**
```bash
npm run build              # Сборка Vue админ-панели
npm run build:admin        # Сборка админ-панели (production)
npm run build:react        # Сборка React приложения
npm run build:all          # Сборка всего
npm run build:admin:safe   # Безопасная сборка админ-панели
npm run dev                # Разработка (Vite)
```

**Frontend package.json:**
```bash
npm run dev                # Разработка
npm run build              # Production сборка
npm run build:dev          # Development сборка
npm run lint               # Линтинг
npm run preview            # Превью сборки
```

### Деплой

**Автоматический деплой:**
- GitHub Actions (при push в main)
- GitHub Webhook (обработка push событий)
- Git Hooks (локальный деплой)

**Ручной деплой:**
```bash
POST /api/deploy
Headers: X-Deploy-Token: {token}
```

---

## 📝 Важные правила работы с проектом

### API пути в Vue компонентах

**КРИТИЧЕСКИ ВАЖНО:** `API_BASE` уже содержит `/api/v1` в `resources/js/utils/api.js`

✅ **ПРАВИЛЬНО:**
```javascript
apiGet('/bots')              // → /api/v1/bots
apiGet('/users')             // → /api/v1/users
apiGet('/bots/1')            // → /api/v1/bots/1
```

❌ **НЕПРАВИЛЬНО:**
```javascript
apiGet('/v1/bots')           // → /api/v1/v1/bots (ОШИБКА!)
apiGet('/api/v1/bots')       // → /api/v1/api/v1/bots (ОШИБКА!)
apiGet('bots')               // → /api/v1bots (ОШИБКА - нет слэша)
```

### Обновление документации

При любых изменениях кода ОБЯЗАТЕЛЬНО обновлять:
- `PROJECT_DOCUMENTATION.md` (если существует)
- `PROJECT_STRUCTURE.md` (этот файл)
- `VERSIONING.md` (при изменении версии)

### Стиль кода

- **PHP:** PSR-12
- **TypeScript:** Строгий режим
- **Комментарии:** Для сложной бизнес-логики
- **Имена:** Осмысленные имена переменных и методов

---

## 🔍 Как использовать эту документацию

При работе с проектом через AI промпты:

1. **Ссылайтесь на конкретные разделы:**
   ```
   "Согласно PROJECT_STRUCTURE.md, раздел 'Backend структура', 
   контроллер UserController находится в app/Http/Controllers/Api/UserController.php"
   ```

2. **Указывайте пути напрямую:**
   ```
   "Используя структуру из PROJECT_STRUCTURE.md, 
   создай компонент в frontend/src/components/sections/"
   ```

3. **Обращайтесь к API endpoints:**
   ```
   "Согласно PROJECT_STRUCTURE.md, раздел 'API Endpoints', 
   для создания пользователя используется POST /api/v1/users"
   ```

4. **Используйте информацию о моделях:**
   ```
   "Согласно PROJECT_STRUCTURE.md, модель User имеет связи: 
   roles (many-to-many), notifications (hasMany), folders (hasMany)"
   ```

---

## 📌 Быстрые ссылки на ключевые файлы

### Backend
- API Routes: `routes/api.php`
- Web Routes: `routes/web.php`
- Конфигурация: `config/`
- Миграции: `database/migrations/`

### Frontend (Vue)
- Точка входа: `resources/js/admin.js`
- API утилиты: `resources/js/utils/api.js`
- Главный компонент: `resources/js/App.vue`
- Layout: `resources/js/layouts/AdminLayout.vue`

### Frontend (React)
- Точка входа: `frontend/src/main.tsx` (предположительно)
- API утилиты: `frontend/src/lib/api.ts`
- Страницы: `frontend/src/pages/`
- Компоненты: `frontend/src/components/`

---

## 🔄 Версионирование документации

**Версия 1.0.0** (Январь 2026)
- Создана базовая структура документации
- Описана полная структура проекта
- Добавлены все API endpoints
- Описаны модели и сервисы
- Добавлены правила работы с проектом

---

**Примечание:** Эта документация должна обновляться при любых изменениях структуры проекта, добавлении новых компонентов, моделей, контроллеров или API endpoints.
