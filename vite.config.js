import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Carrega as variáveis de ambiente com base no modo (development/production)
  const env = loadEnv(mode, process.cwd(), '')

  console.log('Building with env:', {
    mode,
    supabaseUrl: env.VITE_SUPABASE_URL ? 'Defined' : 'Undefined',
    supabaseKey: env.VITE_SUPABASE_ANON_KEY ? 'Defined' : 'Undefined'
  })

  return {
    plugins: [react()],
    base: '/',
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
      commonjsOptions: {
        include: [
          /node_modules/,
          /hoist-non-react-statics/,
          /@emotion\/react/
        ],
        requireReturnsDefault: 'namespace'
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'emotion': ['@emotion/react', '@emotion/styled'],
            'chakra': ['@chakra-ui/react'],
            'vendor': ['react-icons', 'react-router-dom', 'framer-motion']
          }
        }
      },
      sourcemap: true,
      chunkSizeWarningLimit: 1000
    },
    optimizeDeps: {
      include: ['hoist-non-react-statics', '@emotion/react']
    },
    define: {
      __VITE_SUPABASE_URL__: JSON.stringify(env.VITE_SUPABASE_URL || ''),
      __VITE_SUPABASE_ANON_KEY__: JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
      'import.meta.env.MODE': JSON.stringify(mode)
    }
  }
})
