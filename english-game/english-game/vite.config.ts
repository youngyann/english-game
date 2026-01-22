
import { defineConfig } from 'vite';

export default defineConfig({
  // 使用 './' 確保無論專案路徑為何都能正確讀取資源
  base: './',
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
