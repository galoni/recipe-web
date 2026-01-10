import { test, expect } from '@playwright/test';

const MOCK_RECIPE = {
    title: 'E2E Test Pasta',
    description: 'A test pasta recipe extracted from video.',
    thumbnail_url: 'https://example.com/pasta.jpg',
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    servings: 2,
    is_public: false,
    ingredients: [
        { item: 'Pasta', quantity: '500', unit: 'g' }
    ],
    steps: [
        { step_number: 1, instruction: 'Boil water.' },
        { step_number: 2, instruction: 'Cook pasta.' }
    ],
    video_url: 'https://youtube.com/watch?v=mock',
    dietary_tags: ['Italian']
};

const SAVED_RECIPE = {
    ...MOCK_RECIPE,
    id: 123,
    created_at: new Date().toISOString()
};

test.describe('Recipe Extraction Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Mock Authentication
        await page.route('**/api/v1/auth/me', async route => {
            await route.fulfill({ status: 200, json: { id: 1, email: 'test@example.com', full_name: 'Test User' } });
        });

        // Mock Getting User Sessions (Navbar calls this sometimes? or just me)
        await page.route('**/api/v1/security/sessions', async route => {
            await route.fulfill({ status: 200, json: [] });
        });
    });

    test('extracts recipe from validated YouTube URL', async ({ page }) => {
        // Mock Extraction API
        await page.route('**/api/v1/extract', async route => {
            await route.fulfill({ status: 200, json: MOCK_RECIPE });
        });

        // Mock Save API
        await page.route('**/api/v1/recipes/', async route => {
            const data = route.request().postDataJSON();
            await route.fulfill({ status: 201, json: { ...data, id: 123 } });
        });

        // Mock Get Recipe (Target Page)
        await page.route('**/api/v1/recipes/123', async route => {
            await route.fulfill({ status: 200, json: SAVED_RECIPE });
        });

        // 1. Login and go to Dashboard (Mock login is implicit if we mock /me and just go there)
        // But App checks auth on client side. If /me returns user, we are logged in.
        await page.goto('/dashboard');

        // 2. Expect to be on dashboard
        await expect(page.getByText('Neural Extraction Suite', { exact: false })).toBeVisible();

        // 3. Fill URL
        await page.fill('input[placeholder*="youtube.com"]', 'https://youtube.com/watch?v=mock');

        // 4. Submit
        await page.click('button:has-text("Process Stream")');

        // 5. Expect redirect to generate page
        await expect(page).toHaveURL(/.*\/recipe\/generate.*/);

        // 6. Expect loading states
        // It happens fast, but we might catch "Analyzing Stream..."
        await expect(page.getByText('Analyzing Stream...').or(page.getByText('Compiling Data...')).or(page.getByText('Recipe Ready!'))).toBeVisible();

        // 7. Expect redirect to recipe page
        await expect(page).toHaveURL(/.*\/recipe\/123/);

        // 8. Expect Recipe Content
        await expect(page.getByRole('heading', { name: 'E2E Test Pasta' })).toBeVisible();
    });

    test('handles extraction error', async ({ page }) => {
        // Mock Extraction Error
        await page.route('**/api/v1/extract', async route => {
            await route.fulfill({ status: 500, json: { detail: "Failed to download video" } });
        });

        await page.goto('/dashboard');
        await page.fill('input[placeholder*="youtube.com"]', 'https://youtube.com/watch?v=bad');
        await page.click('button:has-text("Process Stream")');

        // Expect final error state
        await expect(page).toHaveURL(/.*\/recipe\/generate.*/);
        await expect(page.getByText('Extraction Failed')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Try Another Video' })).toBeVisible();
    });
});
