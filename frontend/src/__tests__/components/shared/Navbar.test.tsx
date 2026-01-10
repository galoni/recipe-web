import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test-utils/render'
import { Navbar } from '@/components/shared/navbar'
import { User } from '@/lib/types'
import * as apiLib from '@/lib/api'
import * as authLib from '@/lib/auth'

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    ChefHat: () => <span data-testid="icon-chef" />,
    Menu: () => <span data-testid="icon-menu" />,
    LogOut: () => <span data-testid="icon-logout" />,
    User: () => <span data-testid="icon-user" />,
    X: () => <span data-testid="icon-x" />,
    Settings: () => <span data-testid="icon-settings" />,
}))

// Mock Framer Motion
// Mock Framer Motion
/* eslint-disable @typescript-eslint/no-explicit-any */
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick }: any) => <div className={className} onClick={onClick}>{children}</div>,
        button: ({ children, className, onClick, ...props }: any) => <button className={className} onClick={onClick} {...props}>{children}</button>,
        svg: ({ children, className, ...props }: any) => <svg className={className} {...props}>{children}</svg>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
/* eslint-enable @typescript-eslint/no-explicit-any */

// Mock next-themes
vi.mock('next-themes', () => ({
    useTheme: () => ({
        theme: 'light',
        setTheme: vi.fn(),
        resolvedTheme: 'light',
    }),
}))

// Mock API
vi.mock('@/lib/api', () => ({
    getCurrentUser: vi.fn(),
}))

// Mock Auth logic
vi.mock('@/lib/auth', () => ({
    logout: vi.fn(),
}))

describe('Navbar', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders guest navigation correctly', async () => {
        // Mock no user
        vi.mocked(apiLib.getCurrentUser).mockResolvedValue(null)

        render(<Navbar />)

        // Wait for query to resolve and content to appear
        await waitFor(() => {
            expect(screen.getByText('Log in')).toBeInTheDocument()
        })

        // Check public links
        expect(screen.getByText('Gallery')).toBeInTheDocument()
        expect(screen.getByText('Explore')).toBeInTheDocument()

        // Check auth buttons
        expect(screen.getByText('Log in')).toBeInTheDocument()
        expect(screen.getByText('Sign Up')).toBeInTheDocument()

        // Check private links are absent
        expect(screen.queryByText('Studio')).not.toBeInTheDocument()
        expect(screen.queryByText('Library')).not.toBeInTheDocument()
    })

    it('renders authenticated navigation correctly', async () => {
        // Mock user present
        vi.mocked(apiLib.getCurrentUser).mockResolvedValue({
            id: '1',
            email: 'test@example.com',
            full_name: 'Test User'
        } as unknown as User)

        render(<Navbar />)

        // Wait for query to resolve
        await waitFor(() => {
            expect(screen.getByText('Studio')).toBeInTheDocument()
        })

        // Check library link
        expect(screen.getByText('Library')).toBeInTheDocument()

        // Check profile/settings/logout
        expect(screen.getByText('Profile')).toBeInTheDocument()
        expect(screen.getByText('Settings')).toBeInTheDocument()
        expect(screen.getByTestId('icon-logout')).toBeInTheDocument()

        // Check login/signup absent
        expect(screen.queryByText('Log in')).not.toBeInTheDocument()
        expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()
    })

    it('toggles mobile menu', async () => {
        vi.mocked(apiLib.getCurrentUser).mockResolvedValue(null)
        render(<Navbar />)

        await waitFor(() => {
            expect(screen.getByTestId('icon-menu')).toBeInTheDocument()
        })

        const menuButton = screen.getByTestId('icon-menu').closest('button')!

        // Open menu
        fireEvent.click(menuButton)
        expect(screen.getByTestId('icon-x')).toBeInTheDocument()

        // Since mobile menu is rendered in a portal or just fixed div, we check for visibility
        // But in our mock framer-motion, it just renders.
        // The mobile menu contains duplicates of links, so we might find multiple 'Gallery' texts.
        // Let's check for something specific to mobile menu or ensure it appears.

        const galleryLinks = screen.getAllByText('Gallery')
        expect(galleryLinks.length).toBeGreaterThan(1) // Desktop + Mobile

        // Close menu
        const closeButton = screen.getByTestId('icon-x').closest('button')!
        fireEvent.click(closeButton)

        await waitFor(() => {
            expect(screen.queryByTestId('icon-x')).not.toBeInTheDocument()
        })
    })

    it('handles logout', async () => {
        vi.mocked(apiLib.getCurrentUser).mockResolvedValue({ id: 1 } as unknown as User)
        render(<Navbar />)

        await waitFor(() => {
            expect(screen.getByTestId('icon-logout')).toBeInTheDocument()
        })

        const logoutButton = screen.getByTestId('icon-logout').closest('button')!
        fireEvent.click(logoutButton)

        await waitFor(() => {
            expect(authLib.logout).toHaveBeenCalled()
        })
    })
})
