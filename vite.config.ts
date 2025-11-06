
import react from '@vitejs/plugin-react'
import {defineConfig} from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['ogl'],
    force: true
  },
  server: {
    allowedHosts: [
        'loan-data-falling-weights.trycloudflare.com',
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
