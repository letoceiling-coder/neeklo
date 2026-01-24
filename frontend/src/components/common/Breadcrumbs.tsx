import { Link } from "react-router-dom";
import { Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav
      className="flex items-center flex-nowrap overflow-hidden min-w-0 gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-sm text-muted-foreground mb-6 md:mb-8 leading-tight"
      aria-label="Хлебные крошки"
    >
      <span className="inline-flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
        <Link
          to="/"
          className="no-min-touch hover:text-foreground transition-colors inline-flex items-center"
          aria-label="На главную"
        >
          <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
        </Link>
        <span className="text-muted-foreground/50 select-none">/</span>
      </span>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span
            key={index}
            className={
              isLast
                ? "min-w-0 overflow-hidden"
                : "inline-flex items-center gap-0.5 sm:gap-1 flex-shrink-0"
            }
          >
            {isLast ? (
              <span className="block truncate text-foreground font-medium">{item.label}</span>
            ) : (
              <>
                <Link
                  to={item.url}
                  className="no-min-touch hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
                <span className="text-muted-foreground/50 select-none">/</span>
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
};
