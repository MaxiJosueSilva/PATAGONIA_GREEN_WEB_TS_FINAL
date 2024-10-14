import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-leaflet-cluster': 'react-leaflet-cluster/lib/index.js',
    },
  },
  optimizeDeps: {
    include: ['react-leaflet-cluster'],
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase the warning limit to 1000 kB
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          leaflet: ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
})