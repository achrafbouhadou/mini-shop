import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react() , tailwindcss(),],
  server: {
    port: 5173,
    proxy: {
      '/healthz': 'http://localhost:5000'
    }
  }
})
