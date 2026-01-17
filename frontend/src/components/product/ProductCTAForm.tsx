import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, Check, Sparkles } from "lucide-react";
import Confetti from "@/components/ui/confetti";

interface ProductCTAFormProps {
  title?: string;
  subtitle?: string;
  productName: string;
  packages: { id: string; name: string }[];
  selectedPackage?: string;
  telegramLink?: string;
}

export const ProductCTAForm = ({
  title = "Хотите такой же результат?",
  subtitle = "Оставьте контакт — предложим варианты под ваш бюджет",
  productName,
  packages,
  selectedPackage,
  telegramLink = "https://t.me/neeklo",
}: ProductCTAFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    package: selectedPackage || packages[0]?.id || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = formData.name.trim();
    const trimmedContact = formData.contact.trim();
    
    if (!trimmedName || trimmedName.length < 2) {
      toast.error("Введите имя (минимум 2 символа)");
      return;
    }
    
    // Validate contact - phone or telegram
    const isValidPhone = /^[\+]?[\d\s\-\(\)]{5,30}$/.test(trimmedContact);
    const isValidTelegram = /^@?[a-zA-Z0-9_]{3,32}$/.test(trimmedContact);
    
    if (!trimmedContact || (!isValidPhone && !isValidTelegram)) {
      toast.error("Введите корректный телефон или Telegram");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedPkg = packages.find((p) => p.id === formData.package);
      
      const { error } = await supabase.functions.invoke("send-telegram", {
        body: {
          name: formData.name,
          phone: formData.contact,
          email: "",
          role: "Клиент",
          description: `Продукт: ${productName}\nПакет: ${selectedPkg?.name || "Не выбран"}`,
        },
      });

      if (error) throw error;

      toast.success("Заявка отправлена! Свяжемся в ближайшее время");
      setIsSuccess(true);
      setShowConfetti(true);
      setFormData({ name: "", contact: "", package: packages[0]?.id || "" });
      
      setTimeout(() => {
        setIsSuccess(false);
        setShowConfetti(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Ошибка отправки. Попробуйте написать в Telegram");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Confetti isActive={showConfetti} />
      <section className="py-10 sm:py-12 md:py-16">
      <Container>
        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Начните проект</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">{title}</h2>
            <p className="text-muted-foreground text-sm sm:text-base">{subtitle}</p>
          </div>

          {/* Form */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 p-4 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Package Selection - Game Style Buttons */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Выберите пакет
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, package: pkg.id })}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group active:scale-[0.98] ${
                        formData.package === pkg.id
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                          : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.package === pkg.id 
                              ? "border-primary bg-primary" 
                              : "border-muted-foreground"
                          }`}>
                            {formData.package === pkg.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-primary-foreground rounded-full"
                              />
                            )}
                          </div>
                          <span className={`font-medium transition-colors ${
                            formData.package === pkg.id ? "text-primary" : "text-foreground"
                          }`}>
                            {productName} — {pkg.name}
                          </span>
                        </div>
                        
                        {/* Checkmark */}
                        {formData.package === pkg.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ваше имя
                </label>
                <input
                  type="text"
                  placeholder="Как вас зовут?"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 md:h-14 px-4 bg-background/80 border-2 border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
                />
              </div>

              {/* Contact Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Телефон или Telegram
                </label>
                <input
                  type="text"
                  placeholder="+7 (999) 123-45-67 или @username"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full h-12 md:h-14 px-4 bg-background/80 border-2 border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
                />
              </div>

              {/* Submit Button - Game Style */}
              <motion.button
                type="submit"
                disabled={isSubmitting || isSuccess}
                whileTap={{ scale: 0.98 }}
                className={`w-full h-12 md:h-14 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSuccess
                    ? "bg-success text-success-foreground shadow-glow-success"
                    : "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02]"
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Отправка...
                  </>
                ) : isSuccess ? (
                  <>
                    <Check size={18} />
                    Заявка отправлена!
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Обсудить проект
                  </>
                )}
              </motion.button>
            </form>

            {/* Alternative */}
            <p className="mt-6 text-sm text-muted-foreground text-center">
              Или напишите напрямую в{" "}
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                <Send size={12} />
                Telegram
              </a>
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
    </>
  );
};
