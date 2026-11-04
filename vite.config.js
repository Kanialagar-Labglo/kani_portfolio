import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { siteConfig } from './site.config.js';
import { profile } from './src/data/profile.js';
import { socials } from './src/data/socials.js';
import {
  buildHeadTags,
  buildRobotsTxt,
  buildSitemapXml,
  pageTitle,
  siteWarnings,
} from './src/lib/seo.js';

// Writes search and link-preview metadata into index.html and emits the crawler files,
// so they exist in the delivered HTML without running JavaScript.
function seoPlugin() {
  return {
    name: 'portfolio-seo',
    configResolved(config) {
      siteWarnings(siteConfig).forEach((warning) => config.logger.warn(`[seo] ${warning}`));
    },
    transformIndexHtml(html) {
      return html
        .replace(/<title>.*<\/title>/, `<title>${pageTitle(profile)}</title>`)
        .replace('<!-- seo:head -->', buildHeadTags({ profile, socials, site: siteConfig }));
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: buildRobotsTxt(siteConfig.siteUrl),
      });
      if (siteConfig.siteUrl) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: buildSitemapXml(siteConfig.siteUrl),
        });
      }
    },
  };
}

export default defineConfig({
  base: siteConfig.basePath,
  plugins: [react(), seoPlugin()],
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
    include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.js'],
  },
});
