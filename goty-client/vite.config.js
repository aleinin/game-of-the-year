/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
      target: 'esnext',
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
    plugins: [react(), viteTsconfigPaths()],
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
