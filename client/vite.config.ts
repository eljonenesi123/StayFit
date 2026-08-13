import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this as a project page at /StayFit/, so the build needs
  // that base path; the dev server stays at / so local URLs are unaffected.
  base: command === 'build' ? '/StayFit/' : '/',
  plugins: [
    react(),
    VitePWA({
      // devOptions.enabled defaults to false, so no service worker is generated
      // (or registered) under `vite dev` / Live Server — PWA behavior only exists
      // in the production build, per explicit requirement.
      registerType: 'autoUpdate',
      injectRegister: null, // registration is done manually in main.tsx so we can show the update toast
      includeAssets: ['stayfit-logo-64.png', 'stayfit-logo-256.png'],
      manifest: {
        name: 'StayFit',
        short_name: 'StayFit',
        description: 'StayFit — interval timer, exercise library, AI workout & meal plans, and calorie tracking.',
        display: 'standalone',
        start_url: '.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          { src: 'pwa-icons/icon-192-any.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-icons/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'pwa-icons/icon-512-any.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the app shell: build output plus fonts/illustrations/lottie JSON
        // that ship as static files rather than being inlined into JS.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2,json}'],
        navigateFallbackDenylist: [/^\/StayFit\/pwa-icons\//],
        runtimeCaching: [
          {
            // Supabase auth/REST calls: prefer fresh data, fall back to cache when offline.
            urlPattern: ({ url }) => url.origin === 'https://gcrioflbvmyhtmqsrtzz.supabase.co',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 }, // 1 day
            },
          },
          {
            // StayFit's own backend proxy (Anthropic/USDA-backed routes) — same reasoning as Supabase.
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'stayfit-api',
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 }, // 1 hour
            },
          },
          {
            // YouTube exercise video embeds/thumbnails — cache-first for the thumbnail
            // images; the player iframe itself is cross-origin and not cacheable. Placed
            // ahead of the generic same-origin static-asset rule below so it wins first.
            urlPattern: ({ url }) => /\.ytimg\.com$/.test(url.hostname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'youtube-thumbnails',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
            },
          },
          {
            // Lottie animation JSON and illustration/image assets: static and safe to
            // serve from cache first, with occasional background refresh.
            urlPattern: ({ request, url, sameOrigin }) =>
              sameOrigin && (request.destination === 'image' || /\.(?:json|svg)$/.test(url.pathname)),
            handler: 'CacheFirst',
            options: {
              cacheName: 'stayfit-static-assets',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      // lottie-react ships a "browser" (UMD) field that Vite picks over "module" by
      // default; the UMD build's default export is the whole exports object rather
      // than the Lottie component, so force resolution to the real ESM entry.
      'lottie-react': 'lottie-react/build/index.es.js',
      // shadcn/ui-style "@/..." import convention, used by CoverflowCarousel.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
