import type { Page } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email Address').fill('admin@foodline.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(/\/dashboard$/);
}
