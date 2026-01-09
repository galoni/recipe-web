/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginWithEmail, registerWithEmail, verify2FA, getGoogleLoginUrl, logout } from '../../lib/auth';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

describe('Auth Library', () => {
    let originalLocation: Location;

    beforeEach(() => {
        fetchMock.mockReset();
        originalLocation = window.location;
        // Mock window.location
        // We delete it first because it might be a read-only property
        try {
            delete (window as any).location;
        } catch (e) {
            // ignore
        }
        (window as any).location = { href: '' };
    });

    afterEach(() => {
        vi.restoreAllMocks();
        (window as any).location = originalLocation;
    });

    it('loginWithEmail sends correct request', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'fake-token' }),
        });

        await loginWithEmail('test@example.com', 'password123');

        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/auth/token'), expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData),
        }));
    });

    it('loginWithEmail throws on error', async () => {
        fetchMock.mockResolvedValueOnce({ ok: false });
        await expect(loginWithEmail('test', 'pass')).rejects.toThrow('Login failed');
    });

    it('registerWithEmail sends correct request', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 1 }),
        });

        await registerWithEmail('test@example.com', 'password', 'Test User');

        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/auth/register'), expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com', password: 'password', full_name: 'Test User' }),
        }));
    });

    it('verify2FA sends correct request', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        await verify2FA('123456', 'token');

        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/auth/verify-2fa'), expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ code: '123456', challenge_token: 'token' }),
        }));
    });

    it('logout redirects to login', async () => {
        fetchMock.mockResolvedValueOnce({ ok: true });

        await logout();

        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/auth/logout'), expect.any(Object));
        expect(window.location.href).toBe('/login');
    });

    it('getGoogleLoginUrl returns correct url', () => {
        const url = getGoogleLoginUrl();
        expect(url).toContain('/auth/google/login');
    });
});
