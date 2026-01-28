<!DOCTYPE html>
<html lang="ru" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Админ панель</title>
    @php
        // Используем продакшн сборку для стабильной работы
        // В dev режиме можно использовать Vite, но нужно настроить проксирование
        $viteDevUrl = rtrim(env('VITE_DEV_SERVER_URL', ''), '/');
        $useViteDev = false; // Отключаем Vite dev для стабильности
    @endphp
    @if($useViteDev)
        @vite(['resources/css/app.css', 'resources/js/admin.js'])
    @else
        {{-- Используем продакшн сборку --}}
        @php
            $manifestPath = public_path('build/manifest.json');
            if (file_exists($manifestPath)) {
                $manifest = json_decode(file_get_contents($manifestPath), true);
                $cssFile = $manifest['resources/css/app.css']['file'] ?? null;
                $jsFile = $manifest['resources/js/admin.js']['file'] ?? null;
            }
        @endphp
        @if(isset($cssFile))
            <link rel="stylesheet" href="/build/assets/{{ basename($cssFile) }}">
        @endif
        @if(isset($jsFile))
            <script type="module" src="/build/assets/{{ basename($jsFile) }}"></script>
        @endif
    @endif
    <script>
        // КРИТИЧНО: Фильтрация ошибок расширений браузера ДО загрузки Vue приложения
        (function() {
            'use strict';
            // Перехватываем ошибки ДО загрузки скриптов
            const originalErrorHandler = window.onerror;
            window.onerror = function(message, source, lineno, colno, error) {
                if (source && (
                    source.includes('chrome-extension://') ||
                    source.includes('adblock') ||
                    source.includes('content.js') ||
                    source.includes('counter.js') ||
                    source.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')
                )) {
                    return true;
                }
                if (message && typeof message === 'string') {
                    const msgLower = message.toLowerCase();
                    if (msgLower.includes('error handling response') ||
                        (msgLower.includes('indexof') && msgLower.includes('undefined')) ||
                        msgLower.includes('safari is not defined') ||
                        msgLower.includes('unchecked runtime.lasterror')) {
                        return true;
                    }
                }
                if (originalErrorHandler) {
                    return originalErrorHandler.call(this, message, source, lineno, colno, error);
                }
                return false;
            };
            
            // Фильтруем console.error
            const originalError = console.error;
            console.error = function(...args) {
                const errorString = args.join(' ').toLowerCase();
                if (errorString.includes('chrome-extension://') ||
                    errorString.includes('adblock') ||
                    errorString.includes('error handling response') ||
                    errorString.includes('unchecked runtime.lasterror') ||
                    errorString.includes('safari is not defined') ||
                    errorString.includes('indexof') ||
                    errorString.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')) {
                    return;
                }
                originalError.apply(console, args);
            };
            
            // Фильтруем console.warn
            const originalWarn = console.warn;
            console.warn = function(...args) {
                const warnString = args.join(' ').toLowerCase();
                if (warnString.includes('unchecked runtime.lasterror') ||
                    warnString.includes('error handling response') ||
                    warnString.includes('chrome-extension://') ||
                    warnString.includes('adblock')) {
                    return;
                }
                originalWarn.apply(console, args);
            };
        })();
        
        // Применяем тему до загрузки страницы, чтобы избежать мигания
        (function() {
            const theme = localStorage.getItem('theme') || 'light';
            const html = document.documentElement;
            if (theme === 'dark') {
                html.classList.add('dark');
                html.setAttribute('data-theme', 'dark');
                html.style.colorScheme = 'dark';
            } else {
                html.style.colorScheme = 'light';
            }
        })();
    </script>
</head>
<body class="min-h-screen bg-background text-foreground">
    <div id="admin-app"></div>
</body>
</html>

