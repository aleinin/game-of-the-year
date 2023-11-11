import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import * as path from 'path'

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [
      react(),
      eslint({
        exclude: ['/virtual:/**', 'node_modules/**'],
      }),
      viteTsconfigPaths(),
    ],
    server: {
      host: 'localhost',
      port: 3000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
  }
})
