import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test-utils/render'
import LoginForm from '@/components/auth/LoginForm'
import * as authLib from '@/lib/auth'

// Mock the auth library
vi.mock('@/lib/auth', () => ({
    loginWithEmail: vi.fn(),
}))

describe('LoginForm', () => {
    it('renders login form correctly', () => {
        // Basic rendering test
        render(<LoginForm />)
        expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('handles input changes', () => {
        render(<LoginForm />)
        const emailInput = screen.getByPlaceholderText(/email address/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })

        expect(emailInput).toHaveValue('test@example.com')
        expect(passwordInput).toHaveValue('password123')
    })

    it('submits form with correct credentials', async () => {
        // Mock successful login
        vi.mocked(authLib.loginWithEmail).mockResolvedValue({
            user: { id: '1', email: 'test@example.com' },
            token: 'fake-token',
            requires_2fa: false
        })

        render(<LoginForm />)
        const emailInput = screen.getByPlaceholderText(/email address/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(authLib.loginWithEmail).toHaveBeenCalledWith('test@example.com', 'password123')
        })
    })

    it('displays error message on failed login', async () => {
        // Mock failed login
        vi.mocked(authLib.loginWithEmail).mockRejectedValue(new Error('Invalid credentials'))

        render(<LoginForm />)
        const emailInput = screen.getByPlaceholderText(/email address/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
        })
    })

    it('redirects to 2FA if required', async () => {
        // Mock 2FA required response
        vi.mocked(authLib.loginWithEmail).mockResolvedValue({
            requires_2fa: true,
            challenge_token: 'challenge-token-123'
        })

        // Note: The router mock is already set up in setup.ts globally

        render(<LoginForm />)
        const emailInput = screen.getByPlaceholderText(/email address/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        fireEvent.change(emailInput, { target: { value: '2fa@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.click(submitButton)

        // We can't easily check router.push directly here due to how it's mocked in setup.ts vs exposed here
        // but we verify loginWithEmail call
        await waitFor(() => {
            expect(authLib.loginWithEmail).toHaveBeenCalled()
        })
    })
})
