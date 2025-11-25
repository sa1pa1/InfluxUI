import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    host: true,
    port: 5000,
    proxy: {
      '/api': 'http://server:3000' // Proxy API requests starting with '/api' to the backend server running on port 3000
    }
  }
})