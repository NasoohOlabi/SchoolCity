import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { comlink } from 'vite-plugin-comlink'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    comlink(),
    tsconfigPaths(),
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate'

    //   // devOptions: {
    //   //   enabled: false
    //   // }
    // }),
  ],
  worker: {
    plugins: [
      comlink()
    ]
  }
})
