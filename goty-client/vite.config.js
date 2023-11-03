import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        plugins: [react(), eslint(), viteTsconfigPaths()],
        server: {
            host: 'localhost',
            port: 3000
        }
    };
});