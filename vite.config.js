import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Carrega as variáveis de ambiente com base no modo (development/production)
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 3000, // Mudando para porta 3000
      host: true, // Permite acesso externo
      watch: {
        usePolling: true, // Melhor compatibilidade com Windows
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'), // Permits importações using @
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      commonjsOptions: {
        include: [
          /node_modules/,
          /hoist-non-react-statics/,
          /@emotion\/react/
        ],
        requireReturnsDefault: 'namespace',
        transformMixedEsModules: true
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'],
            'emotion': ['@emotion/react', '@emotion/styled'],
            'chakra': ['@chakra-ui/react']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['hoist-non-react-statics', '@emotion/react']
    },
    define: {
      // Garante que as variáveis de ambiente estejam disponíveis
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'process.env': env
    }
  }
})
