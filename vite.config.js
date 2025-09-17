import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/messaging'],
                    ui: ['lucide-react', 'date-fns'],
                },
            },
        },
    },
    server: {
        port: 3000,
        open: true,
    },
    preview: {
        port: 3000,
        open: true,
    },
});
