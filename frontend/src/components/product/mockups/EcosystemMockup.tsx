import { motion } from "framer-motion";
import { Globe, MessageSquare, Bot, Database, Zap } from "lucide-react";

export const EcosystemMockup = () => {
  const nodes = [
    { icon: <Globe className="w-5 h-5" />, label: "Сайт", x: 50, y: 20 },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Telegram", x: 85, y: 45 },
    { icon: <Bot className="w-5 h-5" />, label: "AI", x: 70, y: 75 },
    { icon: <Database className="w-5 h-5" />, label: "CRM", x: 30, y: 75 },
    { icon: <Zap className="w-5 h-5" />, label: "Auto", x: 15, y: 45 },
  ];

  return (
    <div className="relative mx-auto max-w-sm">
      <div className="relative bg-surface border border-border rounded-2xl p-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="font-semibold text-foreground">Digital-экосистема</p>
          <p className="text-xs text-foreground-muted">Все компоненты связаны</p>
        </div>

        {/* Network visualization */}
        <div className="relative h-64 bg-background rounded-xl overflow-hidden">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            {nodes.map((node, i) =>
              nodes.slice(i + 1).map((target, j) => (
                <motion.line
                  key={`${i}-${j}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  strokeOpacity="0.2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                />
              ))
            )}
          </svg>

          {/* Animated data flow */}
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-primary"
            animate={{
              x: ["50%", "85%", "70%", "30%", "15%", "50%"],
              y: ["20%", "45%", "75%", "75%", "45%", "20%"],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ left: 0, top: 0 }}
          />

          {/* Nodes */}
          {nodes.map((node, i) => (
            <motion.div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
            >
              <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-primary shadow-lg">
                {node.icon}
              </div>
              <span className="text-[10px] text-foreground-muted mt-1">{node.label}</span>
            </motion.div>
          ))}

          {/* Center hub */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔗</span>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-2xl -z-10" />
    </div>
  );
};
