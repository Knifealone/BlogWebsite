import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Reads client/.env so VITE_PROXY_TARGET works here as well as in the app.
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  // In development the API runs on another port. Proxying keeps everything on one
  // origin, so the login cookie works without any CORS setup.
  const apiTarget = env.VITE_PROXY_TARGET || 'http://localhost:4000';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        '/api': apiTarget,
        '/uploads': apiTarget,
      },
    },
  };
});
