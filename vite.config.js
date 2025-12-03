import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      global: 'globalThis',
    },
    server: {
      // ✅ PADRÕES DO VITE
      port: 5173,        // Porta padrão do Vite
      host: 'localhost', // Host padrão
      open: true,        // Abre navegador automaticamente
      
      proxy: {
        '/ws': {
          target: env.VITE_API_SPRING,
          ws: true,
          changeOrigin: true
        }
      }
    }
  }
})
