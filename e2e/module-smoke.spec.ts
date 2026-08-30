import { test, expect, type Page } from '@playwright/test';

const mockUser = {
  id: 'u-admin-1',
  name: 'Admin User',
  email: 'admin@cosypos.com',
  role: 'admin',
  isActive: true,
  isEmailVerified: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockStaff = {
  id: 's-001',
  name: 'Alice Johnson',
  email: 'alice@cosypos.com',
  role: 'manager',
  isActive: true,
  phone: '555-0101',
  salary: 42000,
  dateOfBirth: '1990-04-15T00:00:00.000Z',
  age: 35,
  shiftStart: '09:00',
  shiftEnd: '17:00',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockProduct = {
  id: 'p-101',
  name: 'Mango Smoothie',
  sku: 'SKU-101',
  category: 'Beverages',
  price: 8.5,
  quantity: 12,
  unit: 'piece',
  status: 'active',
  perishable: false,
  isInStock: true,
  isLowStock: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

async function mockApiRoutes(page: Page) {
  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          accessToken: 'mock-access-token',
          user: mockUser,
        },
      }),
    });
  });

  await page.route('**/api/v1/users/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { user: mockUser },
      }),
    });
  });

  await page.route('**/api/v1/staff**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          staff: [mockStaff],
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
        },
      }),
    });
  });

  await page.route('**/api/v1/products**', async (route) => {
    const url = route.request().url();

    if (url.includes('/categories')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { categories: ['Beverages', 'Appetizers'] },
        }),
      });
      return;
    }

    if (url.includes('/status-summary')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            counts: { all: 1, active: 1, inactive: 0, draft: 0 },
          },
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          products: [mockProduct],
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
        },
      }),
    });
  });

  await page.route('**/api/v1/dashboard/**', async (route) => {
    const url = route.request().url();

    if (url.includes('/summary')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            dailySales: {
              value: 1245,
              date: '2025-01-15T00:00:00.000Z',
              sparkline: [{ label: 'Mon', value: 10 }, { label: 'Tue', value: 20 }, { label: 'Wed', value: 15 }],
            },
            monthlyRevenue: {
              value: 38250,
              rangeLabel: 'January 2025',
              sparkline: [{ label: 'W1', value: 30 }, { label: 'W2', value: 45 }, { label: 'W3', value: 35 }],
            },
            tableOccupancy: {
              occupiedCount: 16,
              totalTables: 20,
              occupancyPercent: 80,
              sparkline: [{ label: 'L1', value: 70 }, { label: 'L2', value: 85 }, { label: 'L3', value: 80 }],
            },
          },
        }),
      });
      return;
    }

    if (url.includes('/popular-dishes')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            dishes: [
              { productId: 'p-101', name: 'Mango Smoothie', price: 8.5, isInStock: true, quantitySold: 20, revenue: 170 },
            ],
          },
        }),
      });
      return;
    }

    if (url.includes('/overview')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            range: 'daily',
            series: [{ period: 'Mon', sales: 120, revenue: 900 }, { period: 'Tue', sales: 150, revenue: 1100 }],
          },
        }),
      });
    }
  });
}

async function login(page: Page) {
  await mockApiRoutes(page);
  await page.goto('/login');
  await page.getByLabel('Email Address').fill('admin@cosypos.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe('Module smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('dashboard page loads', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByText(/daily sales/i)).toBeVisible();
  });

  test('staff page loads', async ({ page }) => {
    await page.goto('/staff');
    await expect(page).toHaveURL(/\/staff$/);
    await expect(page.getByRole('heading', { name: /^Staff \(\d+\)$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add staff/i })).toBeVisible();
  });

  test('inventory page loads', async ({ page }) => {
    await page.goto('/inventory');
    await expect(page).toHaveURL(/\/inventory$/);
    await expect(page.getByText(/total products/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /add new inventory/i })).toBeVisible();
  });
});
