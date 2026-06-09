import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { reactSourceLocator } from 'vite-plugin-react-source-locator'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactSourceLocator(), react(), tailwindcss()],
  server: {
    port: 3000,
    strictPort: true
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
