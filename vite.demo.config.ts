import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  resolve: {
    alias: {
      'react-chatbot-plugin': resolve(__dirname, 'src/index.ts'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
