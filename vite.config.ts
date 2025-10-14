import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['six-llamas-divide.loca.lt', 'www.viberz.app', 'viberz.app']
  }
})
