import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import React from 'react'

// Automatically cleanup after each test
afterEach(() => {
    cleanup()
    vi.clearAllMocks()
})

// Correctly mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn(),
    }),
    usePathname: () => '/',
}))

// Mock Next.js image
vi.mock('next/image', () => ({
    __esModule: true,
    default: (props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
        return React.createElement('img', props)
    },
}))
