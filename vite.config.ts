import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

/**
 * EduWeConnect Frontend — Vite Configuration
 *
 * Port Convention:
 *   Frontend dev server : 7000
 *   Backend API server  : 7001
 */
export default defineConfig({
  plugins: [react()],

  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port:        7000,
    strictPort:  true,
    open:        false,
    proxy: {
      '/api': {
        target:       'http://localhost:7001',
        changeOrigin: true,
      },
    },
  },

  preview: {
    port: 7000,
  },
})