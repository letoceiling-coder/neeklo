import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "lucide-react";

export const MiniAppMockup = () => {
  const products = [
    { name: "Кофе", price: "350 ₽", rating: 4.9 },
    { name: "Чай", price: "280 ₽", rating: 4.7 },
    { name: "Десерт", price: "420 ₽", rating: 4.8 },
  ];

  return (
    <div className="relative mx-auto max-w-sm">
      <div className="relative bg-surface border border-border rounded-[2.5rem] p-2 shadow-2xl">
        <div className="bg-background rounded-[2rem] overflow-hidden">
          {/* App header */}
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <p className="font-bold text-foreground">☕ CaféApp</p>
              <div className="flex items-center gap-1 bg-primary/20 px-2 py-1 rounded-full">
                <ShoppingCart className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">3</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="p-3 space-y-2 min-h-[280px]">
            <p className="text-xs text-foreground-muted px-1">Популярное</p>
            {products.map((product, i) => (
              <motion.div
                key={i}
                className="bg-surface border border-border rounded-xl p-3 flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xl">
                  {i === 0 ? "☕" : i === 1 ? "🍵" : "🍰"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{product.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-foreground-muted">{product.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-foreground">{product.price}</p>
                  <button className="mt-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-lg leading-none">+</span>
                  </button>
                </div>
              </motion.div>
            ))}

            <motion.button
              className="w-full mt-3 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Оформить заказ — 1 050 ₽
            </motion.button>
          </div>
        </div>
      </div>
      <div className="absolute -inset-4 bg-accent/10 rounded-[3rem] blur-2xl -z-10" />
    </div>
  );
};
