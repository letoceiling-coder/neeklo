import { Search, Map, Layout, Code, Rocket, TrendingUp, LucideIcon } from "lucide-react";
import StickyTabs from "@/components/ui/sticky-section-tabs";

const steps = [
  {
    id: "diagnostics",
    label: "Этап 1",
    title: "Диагностика",
    subtitle: "Погружение в продукт и определение направления работы",
    description: "Разбираемся в продукте, задачах и цифрах бизнеса. Анализируем рынок, конкурентов и целевую аудиторию.",
    Icon: Search,
  },
  {
    id: "strategy",
    label: "Этап 2",
    title: "Стратегия и ТЗ",
    subtitle: "Формирование архитектуры и технического фундамента",
    description: "Формируем архитектуру, CJM и рабочее техническое задание. Определяем ключевые метрики успеха.",
    Icon: Map,
  },
  {
    id: "design",
    label: "Этап 3",
    title: "Дизайн и прототип",
    subtitle: "Визуализация идей и создание интерфейсов",
    description: "Собираем кликабельный прототип и визуальную систему. Тестируем с пользователями.",
    Icon: Layout,
  },
  {
    id: "development",
    label: "Этап 4",
    title: "Разработка",
    subtitle: "Превращение дизайна в работающий продукт",
    description: "Собираем фронт, бэкенд и подключаем нужные сервисы. Пишем чистый, масштабируемый код.",
    Icon: Code,
  },
  {
    id: "launch",
    label: "Этап 5",
    title: "Запуск и тесты",
    subtitle: "Финальная проверка и выход в продакшн",
    description: "Тестируем, выкатываем релиз и включаем аналитику. Обеспечиваем стабильный запуск.",
    Icon: Rocket,
  },
  {
    id: "growth",
    label: "Этап 6",
    title: "Поддержка и рост",
    subtitle: "Масштабирование и непрерывное улучшение",
    description: "Оптимизируем, докручиваем продукт и масштабируем решения. Сопровождаем на всех этапах роста.",
    Icon: TrendingUp,
  },
];

interface StepContentProps {
  description: string;
  Icon: LucideIcon;
}

const StepContent = ({ description, Icon }: StepContentProps) => (
  <div className="flex flex-col items-center justify-center text-center">
    {/* Icon with neon glow */}
    <div className="relative mb-6 md:mb-8">
      {/* Radial gradient background */}
      <div className="absolute inset-0 scale-[2.5] bg-[radial-gradient(ellipse_at_center,rgba(0,113,255,0.2),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,113,255,0.25),transparent_60%)] pointer-events-none" />
      
      {/* Icon container with glow */}
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center
        shadow-[0_0_30px_rgba(0,113,255,0.3)] dark:shadow-[0_0_40px_rgba(0,113,255,0.4)]
        border border-primary/20 dark:border-primary/30">
        <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary drop-shadow-[0_0_8px_rgba(0,113,255,0.5)]" />
      </div>
    </div>
    
    {/* Description text */}
    <p className="text-base md:text-lg leading-relaxed text-foreground-muted dark:text-gray-300 max-w-lg">
      {description}
    </p>
  </div>
);

export const ProcessSticky = () => {
  return (
    <StickyTabs mainNavHeight="5rem">
      {steps.map((step) => (
        <StickyTabs.Item 
          key={step.id} 
          id={step.id}
          label={step.label}
          title={step.title}
          subtitle={step.subtitle}
        >
          <StepContent description={step.description} Icon={step.Icon} />
        </StickyTabs.Item>
      ))}
    </StickyTabs>
  );
};
