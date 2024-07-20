import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: "localhost",
    port: 5666,
    proxy: {
      "/devApi": {
        target: "http://localhost:8800", // 后端地址
        changeOrigin: true,            // 是否换源
        rewrite: (path) => path.replace(/^\/devApi/, "")
      }
    }
  }
})
