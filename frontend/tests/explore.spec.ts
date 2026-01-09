import { test, expect } from '@playwright/test';

const PUBLIC_RECIPES = [
    {
        id: 201,
        title: 'Public Pizza',
        thumbnail_url: null,
        prep_time_minutes: 20,
        cook_time_minutes: 20,
        servings: 4,
        is_public: true,
        created_at: new Date().toISOString()
    },
    {
        id: 202,
        title: 'Community Cake',
        thumbnail_url: null,
        prep_time_minutes: 30,
        cook_time_minutes: 60,
        servings: 8,
        is_public: true,
        created_at: new Date().toISOString()
    }
];

test.describe('Exploration Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Mock Auth (can be guest)
        await page.route('**/api/v1/auth/me', async route => {
            await route.fulfill({ status: 200, json: null }); // Guest
        });
    });

    test('displays public recipes', async ({ page }) => {
        // Mock Explore API
        await page.route('**/api/v1/recipes/explore*', async route => {
            await route.fulfill({ status: 200, json: PUBLIC_RECIPES });
        });

        await page.goto('/explore');

        await expect(page.getByRole('heading', { name: /Explore the/i })).toBeVisible();
        await expect(page.getByText('Public Pizza')).toBeVisible();
        await expect(page.getByText('Community Cake')).toBeVisible();
    });

    test('searches for recipes', async ({ page }) => {
        // Mock Initial Explore
        await page.route('**/api/v1/recipes/explore*', async route => {
            const url = new URL(route.request().url());
            const q = url.searchParams.get('q');

            if (q === 'cake') {
                await route.fulfill({ status: 200, json: [PUBLIC_RECIPES[1]] });
            } else {
                await route.fulfill({ status: 200, json: PUBLIC_RECIPES });
            }
        });

        await page.goto('/explore');
        await expect(page.getByText('Public Pizza')).toBeVisible();

        // Search
        await page.fill('input[placeholder*="Search"]', 'cake');
        await page.press('input[placeholder*="Search"]', 'Enter');

        // Verify filter
        await expect(page.getByText('Public Pizza')).not.toBeVisible();
        await expect(page.getByText('Community Cake')).toBeVisible();
    });
});
