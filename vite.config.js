import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'generateSW',
      injectRegister: false,
      registerType: 'autoUpdate',
      manifestFilename: 'manifest.json',
      manifest: {
        name: 'Agro',
        short_name: 'Agro',
        description: 'Agro PWA para el seguimiento de cultivos',
        lang: 'es-MX',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#173f32',
        background_color: '#173f32',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
})
