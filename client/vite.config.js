import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // /admin is intentionally NOT proxied here.
      // The admin panel is only accessible directly on localhost:5000/admin
      // and is hidden from any shared tunnel or external link.
    },
  },
});
