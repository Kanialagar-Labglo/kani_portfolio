import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { siteConfig } from './site.config.js';

export default defineConfig({
  base: siteConfig.basePath,
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 still uses Sass @import and global functions; hide its deprecation noise.
        quietDeps: true,
        silenceDeprecations: ['import'],
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
  },
});
