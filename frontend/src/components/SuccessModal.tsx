import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/common/Button";
import { motion } from "framer-motion";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export const SuccessModal = ({ open, onClose }: SuccessModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-surface/95 backdrop-blur-xl border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse" />
              <CheckCircle className="relative w-16 h-16 text-primary" />
            </div>
          </motion.div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Спасибо, мы получили вашу заявку!
          </h2>
          
          <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-sm">
            Мы свяжемся с вами в течение 24 часов и подготовим коммерческое предложение.
          </p>

          <Button
            onClick={onClose}
            variant="secondary"
            className="w-full"
          >
            Закрыть
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
