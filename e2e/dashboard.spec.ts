import { test, expect } from '@playwright/test';
import { login } from './mocks';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('loads the stat cards', async ({ page }) => {
    await expect(page.getByText('Daily Sales')).toBeVisible();
    await expect(page.getByText('$1.2K')).toBeVisible();
    await expect(page.getByText('Monthly Revenue')).toBeVisible();
    await expect(page.getByText('Table Occupancy')).toBeVisible();
    await expect(page.getByText('20 Tables')).toBeVisible();
  });

  test('loads both Popular Dishes lists', async ({ page }) => {
    await expect(page.getByText('Top Dishes — By Orders')).toBeVisible();
    await expect(page.getByText('Top Dishes — By Revenue')).toBeVisible();
    await expect(page.getByText('Mango Smoothie').first()).toBeVisible();
    await expect(page.getByText('Order: 20 sold')).toBeVisible();
    await expect(page.getByText('Revenue: $220.00')).toBeVisible();
  });

  test('switches the Overview range and re-fetches the series', async ({ page }) => {
    const overviewRequest = (range: string) =>
      page.waitForRequest((req) => req.url().includes('/dashboard/overview') && req.url().includes(`range=${range}`));

    await expect(page.getByRole('button', { name: 'Monthly' })).toBeVisible();

    const weeklyRequest = overviewRequest('weekly');
    await page.getByRole('button', { name: 'Weekly' }).click();
    await weeklyRequest;

    const dailyRequest = overviewRequest('daily');
    await page.getByRole('button', { name: 'Daily' }).click();
    await dailyRequest;
  });

  test('exports the overview series as a CSV download', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^sales-overview-.*\.csv$/);
  });
});
