import { motion } from "framer-motion";
import { Play, Volume2, Maximize } from "lucide-react";

export const VideoMockup = () => {
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="relative bg-surface border border-border rounded-2xl p-1.5 shadow-2xl overflow-hidden">
        {/* Video player */}
        <div className="relative bg-black rounded-xl overflow-hidden aspect-[9/16]">
          {/* Video preview gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-pink-500/20 to-purple-500/30"
            animate={{
              background: [
                "linear-gradient(135deg, rgba(249,115,22,0.3), rgba(236,72,153,0.2), rgba(168,85,247,0.3))",
                "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(249,115,22,0.3), rgba(236,72,153,0.2))",
                "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.3), rgba(249,115,22,0.3))",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Play button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </motion.div>
          </motion.div>

          {/* Reel indicators */}
          <motion.div
            className="absolute top-4 right-4 flex flex-col gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            {["❤️", "💬", "📤", "🔖"].map((emoji, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-lg">
                  {emoji}
                </div>
                <span className="text-white text-xs mt-1">{Math.floor(Math.random() * 50 + 10)}K</span>
              </div>
            ))}
          </motion.div>

          {/* Bottom info */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <p className="text-white font-semibold text-sm mb-1">@yourcompany</p>
            <p className="text-white/80 text-xs line-clamp-2">
              Новая коллекция уже в продаже 🔥 #реклама #бренд
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
            <motion.div
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: "35%" }}
              transition={{ delay: 0.5, duration: 2 }}
            />
          </div>
        </div>
      </div>
      <div className="absolute -inset-4 bg-orange-500/10 rounded-3xl blur-2xl -z-10" />
    </div>
  );
};
