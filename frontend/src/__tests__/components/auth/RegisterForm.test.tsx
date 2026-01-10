import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterForm from '@/components/auth/RegisterForm';
import { registerWithEmail } from '@/lib/auth';
import { useRouter } from 'next/navigation';

// Mock lib/auth
vi.mock('@/lib/auth', () => ({
    registerWithEmail: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

describe('RegisterForm', () => {
    const mockPush = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useRouter).mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>);
    });

    it('renders register form fields', () => {
        render(<RegisterForm />);
        expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('handles successful registration', async () => {
        vi.mocked(registerWithEmail).mockResolvedValueOnce({ id: 1 } as unknown as Awaited<ReturnType<typeof registerWithEmail>>);

        render(<RegisterForm />);

        fireEvent.change(screen.getByPlaceholderText(/full name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(registerWithEmail).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User');
            expect(screen.getByText(/account created/i)).toBeInTheDocument();
        });

        // Timeout for redirect
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'), { timeout: 2500 });
    });

    it('displays error message on failed registration', async () => {
        vi.mocked(registerWithEmail).mockRejectedValueOnce(new Error('Registration failed'));

        render(<RegisterForm />);

        fireEvent.change(screen.getByPlaceholderText(/full name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText(/an error occurred during registration/i)).toBeInTheDocument();
        });
    });
});
