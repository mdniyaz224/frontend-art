import { test, expect } from '@playwright/test';
import { login } from './helpers';

// The aircraft API is not mocked inside the app (unlike auth), so these tests
// intercept the network call at the browser level instead of depending on a
// real backend.
const AIRCRAFT = {
  id: 'ac-1',
  registrationNumber: 'N12345',
  model: '737 MAX',
  manufacturer: 'Boeing',
  serialNumber: 'SN-1',
  status: 'ACTIVE',
  yearOfManufacture: 2020,
  totalFlightHours: 1000,
  lastMaintenanceDate: null,
  nextMaintenanceDate: null,
  capacity: 180,
  engineType: 'CFM56',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const PAGINATION = {
  page: 1,
  pageSize: 10,
  totalItems: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

test.describe('Aircraft list', () => {
  test('lists aircraft returned by the API', async ({ page }) => {
    await page.route('**/aircraft?**', async (route) => {
      await route.fulfill({
        json: { success: true, data: [AIRCRAFT], pagination: PAGINATION },
      });
    });
    await login(page);

    await page.goto('/aircraft');

    const row = page.getByRole('row', { name: /N12345/ });
    await expect(row).toBeVisible();
    await expect(row).toContainText('737 MAX');
    await expect(row).toContainText('Boeing');
    await expect(row).toContainText('Active');
  });

  test('deletes an aircraft after confirming the dialog', async ({ page }) => {
    let deleted = false;
    await page.route('**/aircraft?**', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: deleted ? [] : [AIRCRAFT],
          pagination: deleted ? { ...PAGINATION, totalItems: 0 } : PAGINATION,
        },
      });
    });
    await page.route('**/aircraft/ac-1', async (route) => {
      deleted = true;
      await route.fulfill({ json: { success: true, data: null } });
    });
    await login(page);

    await page.goto('/aircraft');

    const row = page.getByRole('row', { name: /N12345/ });
    // MUI's Tooltip sets the accessible name via aria-label on the wrapper
    // span (not a native `title` attribute), so target that directly.
    await row.locator('[aria-label="Delete"]').click();

    await expect(page.getByRole('heading', { name: 'Delete Aircraft' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).last().click();

    await expect(page.getByRole('heading', { name: 'Delete Aircraft' })).not.toBeVisible();
    await expect(page.getByText('No aircraft found')).toBeVisible();
  });
});
