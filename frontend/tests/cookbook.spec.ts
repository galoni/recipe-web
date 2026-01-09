import { test, expect } from '@playwright/test';

const RECIPE_LIST = [
    {
        id: 101,
        title: 'Spaghetti Carbonara',
        thumbnail_url: 'https://example.com/carb.jpg',
        prep_time_minutes: 10,
        cook_time_minutes: 15,
        servings: 2,
        is_public: true,
        created_at: new Date().toISOString()
    },
    {
        id: 102,
        title: 'Grilled Cheese',
        thumbnail_url: null,
        prep_time_minutes: 5,
        cook_time_minutes: 5,
        servings: 1,
        is_public: false,
        created_at: new Date().toISOString()
    }
];

test.describe('Cookbook Management', () => {
    test.beforeEach(async ({ page }) => {
        // Mock Auth
        await page.route('**/api/v1/auth/me', async route => {
            await route.fulfill({ status: 200, json: { id: 1, email: 'test@example.com', full_name: 'Test User' } });
        });

        // Mock Sessions (Navbar)
        await page.route('**/api/v1/security/sessions', async route => {
            await route.fulfill({ status: 200, json: [] });
        });
    });

    test('displays user recipes in library', async ({ page }) => {
        // Mock List API
        await page.route('**/api/v1/recipes/', async route => {
            await route.fulfill({ status: 200, json: RECIPE_LIST });
        });

        await page.goto('/cookbook');

        // Check Heading
        await expect(page.getByRole('heading', { name: /Your Vault/i })).toBeVisible();

        // Check Recipe Cards
        await expect(page.getByText('Spaghetti Carbonara')).toBeVisible();
        await expect(page.getByText('Grilled Cheese')).toBeVisible();

        // Check Public/Private Badges (Logic: is_public !== false -> Public)
        await expect(page.getByText('Public')).toBeVisible();
        await expect(page.getByText('Private')).toBeVisible();
    });

    test('deletes a recipe', async ({ page }) => {
        // Mock List API
        await page.route('**/api/v1/recipes/', async route => {
            await route.fulfill({ status: 200, json: [RECIPE_LIST[0]] });
        });

        // Mock Delete API
        await page.route('**/api/v1/recipes/101', async route => {
            expect(route.request().method()).toBe('DELETE');
            await route.fulfill({ status: 204 });
        });

        await page.goto('/cookbook');
        await expect(page.getByText('Spaghetti Carbonara')).toBeVisible();

        // Click delete button on card
        const card = page.locator('.group').filter({ hasText: 'Spaghetti Carbonara' });
        await card.hover();
        await page.getByTitle('Delete Recipe').click();

        // Verify Confirmation Dialog
        await expect(page.getByText('Delete recipe?')).toBeVisible();

        // Confirm Delete
        await page.getByRole('button', { name: 'Delete', exact: true }).click();
    });
});
