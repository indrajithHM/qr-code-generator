import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'QR-CODE-GENERATOR',
        short_name: 'QR-GENERATOR',
        description: 'Generate any data into a QR',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'assets/QRLogo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/QRLogo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })],
   base: '/qr-code-generator/',
})
