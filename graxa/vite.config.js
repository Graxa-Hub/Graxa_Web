import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()
  ],
  server: {
    host: '0.0.0.0', // Isso permite conexões de qualquer IP na sua rede
    port: 5173      // Use a porta padrão do Vite (ou a que você preferir)
  }
})
