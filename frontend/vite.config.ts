import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
      key: fs.readFileSync('../certs/key.pem'),
      cert: fs.readFileSync('../certs/cert.pem'),
    },
  },
});
