import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    optimizeDeps: {
        include: [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-regular-svg-icons',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/react-fontawesome',
            'react-calendar',
            'react-datetime',
            'moment'
        ]
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "resources/css/app.css";`
            }
        }
    }
});
