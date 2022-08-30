import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { comlink } from 'vite-plugin-comlink'
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
  build: {
    sourcemap: true,
  },
  worker: {
    plugins: [
      comlink()
    ]
  }
})
