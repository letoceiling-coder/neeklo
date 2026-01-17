import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
      <Link 
        to="/" 
        className="hover:text-primary transition-colors flex items-center"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4" />
          {index === items.length - 1 ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link 
              to={item.url} 
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};
