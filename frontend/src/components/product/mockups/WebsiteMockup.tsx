import { motion } from "framer-motion";

export const WebsiteMockup = () => {
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="relative bg-surface border border-border rounded-2xl p-1.5 shadow-2xl">
        {/* Browser chrome */}
        <div className="bg-muted/50 rounded-t-xl px-3 py-2 flex items-center gap-2 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-2">
            <div className="bg-background rounded-md px-3 py-1 text-xs text-foreground-muted">
              yoursite.com
            </div>
          </div>
        </div>

        {/* Website content */}
        <div className="bg-background rounded-b-xl overflow-hidden min-h-[300px]">
          {/* Hero */}
          <motion.div
            className="bg-gradient-to-br from-primary/20 via-accent/10 to-background p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="w-16 h-2 bg-primary/40 rounded mb-3"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5 }}
            />
            <motion.div
              className="w-32 h-3 bg-foreground/80 rounded mb-2"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6 }}
            />
            <motion.div
              className="w-24 h-2 bg-foreground-muted/50 rounded mb-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7 }}
            />
            <motion.div
              className="w-20 h-8 bg-primary rounded-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
            />
          </motion.div>

          {/* Cards */}
          <div className="p-4 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="bg-surface border border-border rounded-lg p-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded mb-2" />
                <div className="w-full h-1.5 bg-foreground/20 rounded mb-1" />
                <div className="w-2/3 h-1.5 bg-foreground-muted/30 rounded" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10" />
    </div>
  );
};
