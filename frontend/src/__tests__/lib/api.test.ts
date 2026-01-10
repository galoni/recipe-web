import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from '../../lib/api';

const { mockAxiosInstance } = vi.hoisted(() => ({
    mockAxiosInstance: {
        post: vi.fn(),
        get: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn(),
    }
}));

vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => mockAxiosInstance)
    }
}));

describe('api lib', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('generateRecipe calls correct endpoint', async () => {
        const mockRecipe = { id: '1', title: 'Test' };
        mockAxiosInstance.post.mockResolvedValueOnce({ data: mockRecipe });

        const result = await api.generateRecipe('https://youtube.com/watch?v=123');

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/extract', {
            video_url: 'https://youtube.com/watch?v=123',
        });
        expect(result).toEqual(mockRecipe);
    });

    it('saveRecipe calls correct endpoint', async () => {
        const mockRecipe = { id: '1', title: 'Test' } as unknown as import('../../lib/types').Recipe;
        mockAxiosInstance.post.mockResolvedValueOnce({ data: mockRecipe });

        const result = await api.saveRecipe(mockRecipe);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/recipes/', mockRecipe);
        expect(result).toEqual(mockRecipe);
    });

    it('getRecipes calls correct endpoint', async () => {
        const mockRecipes = [{ id: '1', title: 'Test' }];
        mockAxiosInstance.get.mockResolvedValueOnce({ data: mockRecipes });

        const result = await api.getRecipes();

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/recipes/');
        expect(result).toEqual(mockRecipes);
    });

    it('exploreRecipes calls correct endpoint with query', async () => {
        const mockRecipes = [{ id: '1', title: 'Test' }];
        mockAxiosInstance.get.mockResolvedValueOnce({ data: mockRecipes });

        const result = await api.exploreRecipes('pizza');

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/recipes/explore', {
            params: { q: 'pizza' },
        });
        expect(result).toEqual(mockRecipes);
    });

    it('getRecipeById calls correct endpoint', async () => {
        const mockRecipe = { id: '1', title: 'Test' };
        mockAxiosInstance.get.mockResolvedValueOnce({ data: mockRecipe });

        const result = await api.getRecipeById('1');

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/recipes/1');
        expect(result).toEqual(mockRecipe);
    });

    it('deleteRecipe calls correct endpoint', async () => {
        mockAxiosInstance.delete.mockResolvedValueOnce({});

        await api.deleteRecipe('1');

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/v1/recipes/1');
    });

    it('toggleRecipePrivacy calls correct endpoint', async () => {
        const mockRecipe = { id: '1', title: 'Test', is_public: true };
        mockAxiosInstance.patch.mockResolvedValueOnce({ data: mockRecipe });

        const result = await api.toggleRecipePrivacy('1', true);

        expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/api/v1/recipes/1', { is_public: true });
        expect(result).toEqual(mockRecipe);
    });

    it('getActiveSessions calls correct endpoint', async () => {
        const mockSessions = [{ id: 's1' }];
        mockAxiosInstance.get.mockResolvedValueOnce({ data: mockSessions });

        const result = await api.getActiveSessions();

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/security/sessions');
        expect(result).toEqual(mockSessions);
    });

    it('revokeSession calls correct endpoint', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce({});

        await api.revokeSession('s1');

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/security/sessions/s1/revoke');
    });

    it('revokeAllOtherSessions calls correct endpoint', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce({});

        await api.revokeAllOtherSessions();

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/security/sessions/revoke-others');
    });

    it('getTwoFactorSetup calls correct endpoint', async () => {
        const mockSetup = { secret: 'SEC', otpauth_url: 'url' };
        mockAxiosInstance.post.mockResolvedValueOnce({ data: mockSetup });

        const result = await api.getTwoFactorSetup();

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/security/2fa/setup');
        expect(result).toEqual(mockSetup);
    });

    it('enableTwoFactor calls correct endpoint', async () => {
        const mockResult = { backup_codes: ['C1'] };
        mockAxiosInstance.post.mockResolvedValueOnce({ data: mockResult });

        const result = await api.enableTwoFactor('123456', 'SEC');

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/security/2fa/enable', {
            code: '123456',
            secret: 'SEC',
        });
        expect(result).toEqual(mockResult);
    });

    it('disableTwoFactor calls correct endpoint', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce({});

        await api.disableTwoFactor();

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/security/2fa/disable');
    });

    it('getCurrentUser returns user on success', async () => {
        const mockUser = { id: 1, email: 'test@example.com' };
        mockAxiosInstance.get.mockResolvedValueOnce({ data: mockUser });

        const result = await api.getCurrentUser();

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/auth/me');
        expect(result).toEqual(mockUser);
    });

    it('getCurrentUser returns null on failure', async () => {
        mockAxiosInstance.get.mockRejectedValueOnce(new Error('Unauthorized'));

        const result = await api.getCurrentUser();

        expect(result).toBeNull();
    });

    it('toggleSecurityNotifications calls correct endpoint', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce({ data: { status: 'success' } });

        const result = await api.toggleSecurityNotifications(true);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
            '/api/v1/security/notifications/toggle',
            null,
            { params: { enabled: true } }
        );
        expect(result).toEqual({ status: 'success' });
    });
});
