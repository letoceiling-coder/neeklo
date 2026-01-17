import { motion } from "framer-motion";

export const BrandingMockup = () => {
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="relative bg-surface border border-border rounded-2xl p-4 shadow-2xl">
        {/* Logo variations - intentional light/dark contrast for demo */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { bg: "bg-background", text: "text-foreground" },
            { bg: "bg-foreground", text: "text-background" },
            { bg: "bg-primary", text: "text-primary-foreground" },
            { bg: "bg-gradient-to-br from-primary to-accent", text: "text-primary-foreground" },
          ].map((variant, i) => (
            <motion.div
              key={i}
              className={`${variant.bg} rounded-xl p-4 flex items-center justify-center aspect-square`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className={`font-bold text-2xl ${variant.text}`}>N</div>
            </motion.div>
          ))}
        </div>

        {/* Color palette */}
        <motion.div
          className="bg-background rounded-xl p-3 mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-[10px] text-foreground-muted mb-2">Цветовая палитра</p>
          <div className="flex gap-1">
            {["#7AA2FF", "#6EE7F0", "#A78BFA", "#F472B6", "#FB923C"].map((color, i) => (
              <motion.div
                key={i}
                className="flex-1 h-8 rounded"
                style={{ backgroundColor: color }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.9 + i * 0.05 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Typography */}
        <motion.div
          className="bg-background rounded-xl p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <p className="text-[10px] text-foreground-muted mb-2">Типографика</p>
          <div className="space-y-1">
            <p className="font-bold text-lg text-foreground">Heading Bold</p>
            <p className="text-sm text-foreground">Body Regular</p>
            <p className="text-xs text-foreground-muted">Caption Light</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
