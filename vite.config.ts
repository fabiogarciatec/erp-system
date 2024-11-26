import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true, // Não tenta outras portas se 3000 estiver em uso
    open: true // Abre o navegador automaticamente
  }
})
