import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useMetaTags } from "@/hooks/useMetaTags";
import { StructuredData } from "@/components/common/StructuredData";
import { motion } from "framer-motion";
import { Mail, Send, MapPin, Phone } from "lucide-react";
import { ContactFormModern } from "@/components/common/ContactFormModern";

const contactInfo = [
  {
    icon: Send,
    label: "Telegram",
    value: "@neeklo",
    href: "https://t.me/neeklo",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Phone,
    label: "Телефон",
    value: "+7 (999) 123-45-67",
    href: "tel:+79991234567",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Mail,
    label: "Email",
    value: "klochkonikita@mail.ru",
    href: "mailto:klochkonikita@mail.ru",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: MapPin,
    label: "Адрес",
    value: "Москва, Россия",
    href: null,
    color: "from-orange-500 to-red-500",
  },
];

const Contact = () => {
  useMetaTags(
    "Контакты — Neeklo Studio | Заказать сайт, бота, AI-решение в Москве",
    "Свяжитесь с Neeklo Studio для заказа веб-сайта, Telegram-бота, AI-ассистента или видео. Бесплатная консультация. Москва, Россия.",
    "https://neeklo.ru/og-contact.jpg",
    "https://neeklo.ru/contact",
    "контакты neeklo, заказать сайт москва, разработка сайтов, telegram бот заказать, ai ассистент, веб студия москва"
  );

  // Structured data for contact page (SEO)
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Контакты Neeklo Studio",
    "description": "Страница контактов digital-студии Neeklo. Закажите сайт, бота или AI-решение.",
    "url": "https://neeklo.ru/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Neeklo Studio",
      "telephone": "+7 (999) 123-45-67",
      "email": "klochkonikita@mail.ru",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Москва",
        "addressCountry": "RU"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+7 (999) 123-45-67",
        "email": "klochkonikita@mail.ru",
        "availableLanguage": ["Russian", "English"]
      }
    }
  };

  return (
    <>
      <StructuredData data={contactPageSchema} />
      <div className="min-h-screen bg-background">
      <main className="pt-24 md:pt-32 pb-16 md:pb-20">
        <Container>
          {/* Заголовок страницы — минимально */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Контакты
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Форма заявки и способы связи
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[minmax(0,680px),1fr] gap-8 lg:gap-12 items-start">
              {/* Форма — тёмная панель, max-w-[500px], на десктопе слева */}
              <div className="w-full flex justify-center lg:justify-start">
                <ContactFormModern />
              </div>

              {/* Контакты — справа на десктопе */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                {/* Contact Cards */}
                <div className="space-y-3">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    >
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="
                            flex items-center gap-4 p-4 rounded-xl
                            bg-card border border-border
                            hover:border-primary/50 hover:bg-card/80
                            transition-all duration-200 group
                          "
                        >
                          <div className={`
                            w-10 h-10 rounded-lg bg-gradient-to-br ${item.color}
                            flex items-center justify-center flex-shrink-0
                            group-hover:scale-110 transition-transform
                          `}>
                            <item.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="font-medium text-foreground truncate">{item.value}</p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                          <div className={`
                            w-10 h-10 rounded-lg bg-gradient-to-br ${item.color}
                            flex items-center justify-center flex-shrink-0
                          `}>
                            <item.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="font-medium text-foreground truncate">{item.value}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Social */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
                >
                  <h3 className="text-sm font-semibold mb-3">Социальные сети</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Instagram", url: "https://instagram.com/neeklo.studio" },
                      { name: "LinkedIn", url: "https://linkedin.com/company/neeklo-studio" },
                      { name: "Behance", url: "https://behance.net/neeklostudio" },
                    ].map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          px-3 py-1.5 rounded-full text-xs font-medium
                          bg-background border border-border
                          hover:border-primary/50 hover:text-primary
                          transition-all duration-200
                        "
                      >
                        {social.name}
                      </a>
                    ))}
                  </div>
                </motion.div>

                {/* Hours */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  className="p-5 rounded-xl bg-card border border-border"
                >
                  <h3 className="text-sm font-semibold mb-2">График работы</h3>
                  <p className="text-sm text-muted-foreground">Пн-Пт: 10:00 – 19:00</p>
                  <p className="text-xs text-muted-foreground mt-1">Заявки 24/7</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
    </>
  );
};

export default Contact;
