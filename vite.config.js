import { defineConfig } from 'vite';
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const STATIC_ASSETS = ['icons', 'menu-icons', 'manifest.json', 'service-worker.js'];

export default defineConfig({
  publicDir: false,
  plugins: [
    {
      name: 'copy-static-assets',
      apply: 'build',
      closeBundle() {
        const root = process.cwd();
        const out = resolve(root, 'dist');
        for (const item of STATIC_ASSETS) {
          const src = resolve(root, item);
          if (existsSync(src)) {
            cpSync(src, resolve(out, item), { recursive: true, force: true });
          }
        }
      }
    }
  ]
});
