import react from '@vitejs/plugin-react'
import {defineConfig} from "vitest/config";
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        viteCompression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 1024,
        })],
    optimizeDeps: {
        include: ['ogl'],
        force: true
    },
    build: {
        cssCodeSplit: true,
        minify: 'esbuild',
    },
    server: {
        allowedHosts: [
            'passengers-fabric-responsibilities-secondary.trycloudflare.com',
            'www.viberz.app',
            'viberz.app'
        ]
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        css: false,
    },
})
