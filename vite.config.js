import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    server: {
        host: "::",
        port: 5173,
        hmr: {
            host: 'localhost',
            port: 8080, // HMR через проксирование на порту 8080
            protocol: 'ws',
        },
        cors: {
            origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:5173'],
            credentials: true,
        },
    },
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/admin.js', // Vue админка
            ],
            refresh: true,
        }),
        vue(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.esm-bundler.js',
        },
    },
    // React приложение запускается отдельно на порту 8080
    // Laravel будет отдавать React через blade шаблон, который подключает Vite dev server в dev режиме
});
