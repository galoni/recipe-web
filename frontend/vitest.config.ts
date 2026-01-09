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
                lines: 10,
                functions: 10,
                branches: 10,
                statements: 10,
            },
            exclude: [
                'node_modules/**',
                'src/test-utils/**',
                '**/*.d.ts',
                '**/*.config.*',
                '.next/**',
                'src/app/**', // E2E tested
                'src/lib/**', // API/Auth logic
                'tests/**', // E2E tests
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
