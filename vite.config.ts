import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['ogl'],
    force: true
  },
  server: {
    allowedHosts: ['rates-partially-shame-antenna.trycloudflare.com', 'www.viberz.app', 'viberz.app']
  }
})
