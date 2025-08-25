import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy /api to Flask on 5000 so there's no CORS in dev
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:5000' },
    port: 5173,
    host: true
  }
})