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
        // target: "http://localhost:4523", // 后端地址
        target: "https://apifoxmock.com/m1/4684209-4335706-default", // 后端地址
        changeOrigin: true,            // 是否换源
        rewrite: (path) => path.replace(/^\/devApi/, "")
      }
    }
  },

  css: {
    // css预处理器
    preprocessorOptions: {
      scss: {
        // additionalData: '@import "@/assets/style/mixin.scss";'
      }
    }
  }

})
