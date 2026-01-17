import { Star } from "lucide-react";
import { Card } from "./Card";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  stars: number;
}

export const TestimonialCard = ({ quote, author, role, company, stars }: TestimonialCardProps) => {
  return (
    <Card className="h-full flex flex-col" hover={false}>
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>
      
      {/* Quote */}
      <blockquote className="text-foreground/90 italic text-lg leading-relaxed mb-6 flex-grow">
        "{quote}"
      </blockquote>
      
      {/* Author Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <span className="text-lg font-heading font-bold text-primary">
            {author.charAt(0)}
          </span>
        </div>
        
        <div>
          <div className="font-semibold text-foreground">{author}</div>
          <div className="text-sm text-muted-foreground">
            {role} • {company}
          </div>
        </div>
      </div>
    </Card>
  );
};
