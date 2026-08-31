import { test, expect } from '@playwright/test';
import { login, mockApiRoutes } from './mocks';

test.describe('Auth', () => {
  test('signs in and lands on the dashboard', async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/login');

    await page.getByLabel('Email Address').fill('admin@cosypos.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('shows validation errors for an empty form', async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/login');

    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Email is required')).toBeVisible();
    // Note: the schema chains .min(6) before .required(), so an empty
    // password surfaces the min-length message rather than "required".
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('redirects back to login when visiting a protected route unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('logs out and returns to login', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: 'Account' }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/\/login$/);

    // The session is really gone — a protected route bounces back to login.
    await page.goto('/staff');
    await expect(page).toHaveURL(/\/login$/);
  });
});
