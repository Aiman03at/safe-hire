import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/proxy': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: () => '/v1/messages',
          headers: {
            'anthropic-version': '2023-06-01',
            'x-api-key': env.VITE_ANTHROPIC_API_KEY || '',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
        },
      },
    },
  }
})
