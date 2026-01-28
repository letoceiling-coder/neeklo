import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/animations.css";

// Фильтрация ошибок расширений браузера (должна быть в самом начале)
if (typeof window !== 'undefined') {
    // Перехватываем глобальные ошибки
    const originalErrorHandler = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        // Игнорируем ошибки из расширений браузера
        if (source && (
            source.includes('chrome-extension://') ||
            source.includes('adblock') ||
            source.includes('content.js') ||
            source.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')
        )) {
            return true; // Предотвращаем показ ошибки
        }
        // Также проверяем сообщение об ошибке
        if (message && (
            typeof message === 'string' && (
                message.includes('chrome-extension://') ||
                message.includes('adblock') ||
                message.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')
            )
        )) {
            return true;
        }
        // Вызываем оригинальный обработчик для остальных ошибок
        if (originalErrorHandler) {
            return originalErrorHandler.call(this, message, source, lineno, colno, error);
        }
        return false;
    };
    
    // Перехватываем необработанные промисы
    window.addEventListener('unhandledrejection', function(event) {
        const reason = event.reason?.message || event.reason?.toString() || '';
        if (reason.includes('message port closed') || 
            reason.includes('chrome-extension://') ||
            reason.includes('adblock') ||
            reason.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')) {
            event.preventDefault();
            return false;
        }
    });
    
    // Фильтруем console.error
    const originalError = console.error;
    console.error = function(...args) {
        const errorString = args.join(' ').toLowerCase();
        // Фильтруем ошибки из расширений браузера
        if (errorString.includes('chrome-extension://') || 
            errorString.includes('adblock') ||
            errorString.includes('message port closed') ||
            errorString.includes('safari is not defined') ||
            errorString.includes('content.js') ||
            errorString.includes('indexof') ||
            errorString.includes('error handling response') ||
            errorString.includes('upgrade required') ||
            errorString.includes('426') ||
            errorString.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')) {
            return; // Не показываем эти ошибки
        }
        originalError.apply(console, args);
    };
    
    // Фильтруем console.warn
    const originalWarn = console.warn;
    console.warn = function(...args) {
        const warnString = args.join(' ').toLowerCase();
        if (warnString.includes('runtime.lasterror') ||
            warnString.includes('message port closed') ||
            warnString.includes('unchecked runtime.lasterror') ||
            warnString.includes('chrome-extension://') ||
            warnString.includes('adblock')) {
            return;
        }
        originalWarn.apply(console, args);
    };
    
    // Перехватываем ошибки загрузки ресурсов через addEventListener (не блокируем выполнение)
    window.addEventListener('error', function(event) {
        // Фильтруем только ошибки из расширений, не блокируем остальные
        if (event.target && (
            (event.target.src && typeof event.target.src === 'string' && event.target.src.includes('chrome-extension://')) ||
            (event.target.href && typeof event.target.href === 'string' && event.target.href.includes('chrome-extension://')) ||
            (event.target.src && typeof event.target.src === 'string' && event.target.src.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')) ||
            (event.target.href && typeof event.target.href === 'string' && event.target.href.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn'))
        )) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }, true);
}

// Убеждаемся, что root элемент существует перед рендерингом
const rootElement = document.getElementById("root");
if (!rootElement) {
    console.error("Root element not found!");
    throw new Error("Root element #root not found in DOM");
}

// Убираем opacity:0 сразу, чтобы контент был виден
rootElement.style.opacity = "1";

// Рендерим приложение
createRoot(rootElement).render(<App />);
