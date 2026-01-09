import { test, expect } from '@playwright/test';

const SESSIONS = [
    {
        id: 'sess_1',
        device_type: 'desktop',
        browser_name: 'Chrome',
        browser_version: '120.0',
        os_name: 'Mac OS',
        os_version: '10.15',
        ip_address: '127.0.0.1',
        location_city: 'Tel Aviv',
        location_country: 'Israel',
        last_active_at: new Date().toISOString(),
        is_current: true
    }
];

test.describe('Profile Management', () => {
    test.beforeEach(async ({ page }) => {
        // Mock Auth
        await page.route('**/api/v1/auth/me', async route => {
            await route.fulfill({ status: 200, json: { id: 1, email: 'test@example.com', full_name: 'Test Profile User' } });
        });

        // Mock Sessions (Navbar uses it, Profile uses it)
        await page.route('**/api/v1/security/sessions', async route => {
            await route.fulfill({ status: 200, json: SESSIONS });
        });
    });

    test('displays user profile', async ({ page }) => {
        await page.goto('/profile');

        await expect(page.getByRole('heading', { name: 'Test Profile User' })).toBeVisible();

        // Use getByText for values in ProfileStat which are just text
        await expect(page.getByText('test@example.com')).toBeVisible();

        // Sessions not on this page
    });
});
