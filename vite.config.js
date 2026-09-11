import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const root = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        app: resolve(root, 'react_app.html'),
        main: resolve(root, 'index.html'),
        chikmagalur: resolve(root, 'chikmagalur_trip_architect.html'),
        vietnam: resolve(root, 'vietnam_trip_architect_5_0.html'),
        trip: resolve(root, 'trip.html')
      }
    }
  }
});
