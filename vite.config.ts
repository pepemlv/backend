import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Adjust paths to your SSL certs (create self-signed certs if you don't have any)
const certPath = path.resolve(__dirname, 'certs/localhost.pem');
const keyPath = path.resolve(__dirname, 'certs/localhost-key.pem');

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/database', 'sonner'],
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    /*https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    },*/
    port: 3000,
  },
});
