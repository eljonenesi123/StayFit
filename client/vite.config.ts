import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this as a project page at /StayFit/, so the build needs
  // that base path; the dev server stays at / so local URLs are unaffected.
  base: command === 'build' ? '/StayFit/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      // lottie-react ships a "browser" (UMD) field that Vite picks over "module" by
      // default; the UMD build's default export is the whole exports object rather
      // than the Lottie component, so force resolution to the real ESM entry.
      'lottie-react': 'lottie-react/build/index.es.js',
    },
  },
}))
