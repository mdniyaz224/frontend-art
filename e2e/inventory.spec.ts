import { test, expect } from '@playwright/test';
import { login, makeProduct } from './mocks';

test.describe('Inventory', () => {
  test('list loads with the expected columns and no ID column', async ({ page }) => {
    await login(page, { products: [makeProduct({ name: 'Mango Smoothie' })] });
    await page.goto('/inventory');

    await expect(page.getByText('1 total products')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add New Inventory' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'ID', exact: true })).toHaveCount(0);
    await expect(page.getByRole('columnheader', { name: 'Product' })).toBeVisible();
    await expect(page.getByText('Mango Smoothie')).toBeVisible();
  });

  test('search filters the product list', async ({ page }) => {
    await login(page, {
      products: [makeProduct({ name: 'Mango Smoothie', sku: 'SKU-1' }), makeProduct({ name: 'Chicken Parmesan', sku: 'SKU-2' })],
    });
    await page.goto('/inventory');
    await expect(page.getByText('Chicken Parmesan')).toBeVisible();

    await page.getByPlaceholder('Search products by name or SKU').fill('Mango');
    await expect(page.getByText('Chicken Parmesan')).not.toBeVisible();
    await expect(page.getByText('Mango Smoothie')).toBeVisible();
  });

  test('status filter narrows the product list', async ({ page }) => {
    await login(page, {
      products: [makeProduct({ name: 'Mango Smoothie', status: 'active' }), makeProduct({ name: 'Seasonal Pie', status: 'draft' })],
    });
    await page.goto('/inventory');
    await expect(page.getByText('Seasonal Pie')).toBeVisible();

    await page.getByText('Active', { exact: true }).first().click();

    await expect(page.getByText('Seasonal Pie')).not.toBeVisible();
    await expect(page.getByText('Mango Smoothie')).toBeVisible();
  });

  test('creates a new product', async ({ page }) => {
    await login(page, { products: [] });
    await page.goto('/inventory');

    await page.getByRole('button', { name: 'Add New Inventory' }).click();
    await page.getByLabel('Name').fill('New Dish');
    await page.getByRole('combobox', { name: 'Select or enter a category' }).fill('Main Course');
    await page.getByLabel('Quantity').fill('20');
    await page.getByLabel('Price').fill('12.5');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('New Dish')).toBeVisible();
  });

  test('edits an existing product', async ({ page }) => {
    await login(page, { products: [makeProduct({ name: 'Mango Smoothie', price: 8.5 })] });
    await page.goto('/inventory');

    await page.locator('tbody tr').first().getByRole('button').first().click(); // edit icon
    await page.getByLabel('Price').fill('9.99');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('$9.99')).toBeVisible();
  });

  test('adjusts stock for a product', async ({ page }) => {
    await login(page, { products: [makeProduct({ name: 'Mango Smoothie', quantity: 12 })] });
    await page.goto('/inventory');

    // Adjust Stock is reached from inside the edit drawer, not directly from the table.
    await page.locator('tbody tr').first().getByRole('button').first().click(); // edit icon
    await page.getByRole('button', { name: 'Adjust Stock' }).click();
    await page.getByRole('button', { name: 'Add stock' }).click();
    await page.getByLabel('Quantity').fill('5');
    await page.getByLabel('Reason').fill('Restock delivery');
    await page.getByRole('button', { name: 'Save' }).click();

    await page.keyboard.press('Escape'); // close the edit drawer
    await expect(page.locator('tbody tr').first()).toContainText('17');
  });

  test('views the stock adjustment history', async ({ page }) => {
    await login(page, { products: [makeProduct({ name: 'Mango Smoothie' })] });
    await page.goto('/inventory');

    await page.locator('tbody tr').first().getByRole('button').nth(1).click(); // stock history icon
    await expect(page.getByText('Stock Adjustment History')).toBeVisible();
  });

  test('deletes a product', async ({ page }) => {
    await login(page, { products: [makeProduct({ name: 'Mango Smoothie' })] });
    await page.goto('/inventory');

    await page.locator('tbody tr').first().getByRole('button').last().click(); // delete icon
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByText('Mango Smoothie')).not.toBeVisible();
  });
});
