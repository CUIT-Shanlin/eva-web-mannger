import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({command, mode})=>{
  const env = loadEnv(mode, './');
  return {
    base: './',
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
        "/api": {
          // target: "https://apifoxmock.com/m1/4684209-4335706-default",
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
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
  }
})
