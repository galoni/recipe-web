/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test-utils/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            thresholds: {
                lines: 70,
                functions: 70,
                branches: 70,
                statements: 70,
            },
            exclude: [
                'node_modules/**',
                'src/test-utils/**',
                '**/*.d.ts',
                '**/*.config.*',
                '.next/**',
            ],
        },
        include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
