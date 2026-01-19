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
    <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground mb-6 md:mb-8 flex-wrap">
      <Link 
        to="/" 
        className="hover:text-foreground transition-colors flex items-center gap-1"
      >
        <Home className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5 md:gap-2">
          <span className="text-muted-foreground/50">/</span>
          {index === items.length - 1 ? (
            <span className="text-foreground font-medium truncate">{item.label}</span>
          ) : (
            <Link 
              to={item.url} 
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};
