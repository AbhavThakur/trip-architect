import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const root = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        app: resolve(root, 'react_app.html'),
        main: resolve(root, 'index.html'),
        chikmagalur: resolve(root, 'chikmagalur_trip_architect.html'),
        vietnam: resolve(root, 'vietnam_trip_architect_5_0.html'),
        trip: resolve(root, 'trip.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('leaflet')) return 'vendor-leaflet';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            return 'vendor-libs';
          }
        }
      }
    }
  }
});
