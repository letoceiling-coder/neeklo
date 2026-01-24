<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }}</title>

    @php
        // Локальная разработка: загрузка с Vite dev server (порт 8080)
        $viteDevUrl = rtrim(env('VITE_DEV_SERVER_URL', ''), '/');
        $useViteDev = (config('app.env') === 'local' && $viteDevUrl !== '');

        $cssFiles = [];
        $jsFiles = [];

        if (!$useViteDev) {
            $indexHtmlPath = public_path('frontend/index.html');
            $assetsPath = public_path('frontend/assets');

            if (file_exists($indexHtmlPath)) {
                $htmlContent = file_get_contents($indexHtmlPath);
                preg_match_all('/<link[^>]*href=["\']([^"\']*\.css[^"\']*)["\'][^>]*>/i', $htmlContent, $cssMatches);
                if (!empty($cssMatches[1])) {
                    foreach ($cssMatches[1] as $cssPath) {
                        if (!str_contains($cssPath, 'fonts.googleapis')) $cssFiles[] = $cssPath;
                    }
                }
                preg_match_all('/<script[^>]*src=["\']([^"\']*\.js[^"\']*)["\'][^>]*>/i', $htmlContent, $jsMatches);
                if (!empty($jsMatches[1])) {
                    foreach ($jsMatches[1] as $jsPath) {
                        if (!str_contains($jsPath, 'registerSW')) $jsFiles[] = $jsPath;
                    }
                }
            }

            if (empty($jsFiles) && is_dir($assetsPath)) {
                $files = glob($assetsPath . '/index-*.js');
                if (!empty($files)) {
                    foreach ($files as $file) {
                        $jsFiles[] = '/assets/' . basename($file);
                    }
                }
            }
            if (empty($cssFiles) && is_dir($assetsPath)) {
                $files = glob($assetsPath . '/index-*.css');
                if (!empty($files)) {
                    foreach ($files as $file) {
                        $cssFiles[] = '/assets/' . basename($file);
                    }
                }
            }
        }
    @endphp

    @if($useViteDev)
        {{-- Локальная разработка: Vite dev server с HMR --}}
        <script type="module" src="{{ $viteDevUrl }}/@vite/client"></script>
        <script type="module" src="{{ $viteDevUrl }}/src/main.tsx"></script>
    @elseif(!empty($jsFiles))
        {{-- Подключение собранных файлов React --}}
        @foreach($cssFiles as $css)
            @if(str_starts_with($css, 'http://') || str_starts_with($css, 'https://'))
                <link rel="stylesheet" href="{{ $css }}">
            @else
                <link rel="stylesheet" href="{{ str_starts_with($css, '/') ? $css : asset($css) }}">
            @endif
        @endforeach
        @foreach($jsFiles as $js)
            @if(str_starts_with($js, 'http://') || str_starts_with($js, 'https://'))
                <script type="module" src="{{ $js }}"></script>
            @else
                <script type="module" src="{{ str_starts_with($js, '/') ? $js : asset($js) }}"></script>
            @endif
        @endforeach
    @else
        {{-- React не собран и Vite dev не задан — подсказка в body --}}
        <script>console.warn('React: задайте VITE_DEV_SERVER_URL и запустите Vite ИЛИ выполните npm run build:react');</script>
    @endif
</head>

<body>
    @if(!$useViteDev && empty($jsFiles))
        <style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#e5e5e5;font-family:system-ui,sans-serif;}</style>
        <div style="text-align:center;max-width:420px;padding:24px;">
            <h2 style="margin-bottom:12px;">React приложение не подключено</h2>
            <p style="margin-bottom:16px;opacity:.8;">Для локального просмотра:</p>
            <p style="margin-bottom:8px;"><strong>1.</strong> В <code>.env</code>: <code>VITE_DEV_SERVER_URL=http://localhost:8080</code></p>
            <p style="margin-bottom:8px;"><strong>2.</strong> Терминал 1: <code>php artisan serve</code></p>
            <p style="margin-bottom:8px;"><strong>3.</strong> Терминал 2: <code>cd frontend && npm run dev</code></p>
            <p style="margin-top:16px;opacity:.8;">Или соберите: <code>npm run build:react</code></p>
        </div>
    @else
        <div id="root"></div>
    @endif
</body>
</html>
