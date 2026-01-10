import { test, expect } from '@playwright/test';

test('login page has correct title and form', async ({ page }) => {
    await page.goto('/login');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/ChefStream/);

    // Check for email and password fields
    await expect(page.getByPlaceholder('Email address')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();

    // Check for Sign In button
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
});

test('navigate to register page', async ({ page }) => {
    await page.goto('/login');

    // Find link to register and click it
    await page.click('text=Create Identity');

    // Verify we are on register page
    await expect(page).toHaveURL(/.*register/);
    await expect(page.getByRole('heading', { name: /secure access/i })).toBeVisible();
});
