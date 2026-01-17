import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'neeklo_cookie_consent';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to not block initial render
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allAccepted);
  };

  const handleAcceptSelected = () => {
    saveConsent(preferences);
  };

  const handleRejectOptional = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(onlyNecessary);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-5 md:p-6">
            {!showSettings ? (
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2.5 rounded-xl bg-primary/10 flex-shrink-0">
                    <Cookie className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Мы используем cookies
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Для улучшения работы сайта и анализа трафика. 
                      Продолжая использовать сайт, вы соглашаетесь с{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Политикой конфиденциальности
                      </Link>.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="flex-1 md:flex-none text-muted-foreground hover:text-foreground"
                  >
                    <Settings className="w-4 h-4 mr-1.5" />
                    Настроить
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectOptional}
                    className="flex-1 md:flex-none"
                  >
                    Только необходимые
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="flex-1 md:flex-none bg-primary hover:bg-primary/90"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    Принять все
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Настройки cookies
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-3">
                  <CookieOption
                    title="Необходимые"
                    description="Обеспечивают работу сайта. Отключить нельзя."
                    checked={true}
                    disabled={true}
                    onChange={() => {}}
                  />
                  <CookieOption
                    title="Аналитические"
                    description="Помогают понять, как посетители используют сайт."
                    checked={preferences.analytics}
                    onChange={(checked) => setPreferences(p => ({ ...p, analytics: checked }))}
                  />
                  <CookieOption
                    title="Маркетинговые"
                    description="Используются для показа персонализированной рекламы."
                    checked={preferences.marketing}
                    onChange={(checked) => setPreferences(p => ({ ...p, marketing: checked }))}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectOptional}
                    className="flex-1"
                  >
                    Отклонить все
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptSelected}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Сохранить выбор
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

interface CookieOptionProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

const CookieOption = ({ title, description, checked, disabled, onChange }: CookieOptionProps) => (
  <label className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
    disabled ? 'bg-muted/30 border-border/30' : 'border-border/50 hover:bg-muted/20'
  }`}>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-0.5 w-4 h-4 rounded border-border accent-primary"
    />
    <div className="flex-1">
      <div className="font-medium text-sm text-foreground">{title}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  </label>
);
