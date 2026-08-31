import type { Page } from '@playwright/test';

export const mockUser = {
  id: 'u-admin-1',
  name: 'Admin User',
  email: 'admin@cosypos.com',
  role: 'admin',
  isActive: true,
  isEmailVerified: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export interface MockStaff {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  phone: string;
  salary: number;
  dateOfBirth: string;
  age: number;
  shiftStart: string;
  shiftEnd: string;
  address?: string;
  additionalDetails?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  status: string;
  perishable: boolean;
  isInStock: boolean;
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export function makeStaff(overrides: Partial<MockStaff> = {}): MockStaff {
  return {
    id: `s-${Math.random().toString(36).slice(2, 8)}`,
    name: 'Alice Johnson',
    email: 'alice@cosypos.com',
    role: 'manager',
    isActive: true,
    phone: '5550101',
    salary: 42000,
    dateOfBirth: '1990-04-15T00:00:00.000Z',
    age: 35,
    shiftStart: '09:00',
    shiftEnd: '17:00',
    address: '',
    additionalDetails: '',
    profilePicture: '',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function makeProduct(overrides: Partial<MockProduct> = {}): MockProduct {
  return {
    id: `p-${Math.random().toString(36).slice(2, 8)}`,
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
    ...overrides,
  };
}

interface MockDataStore {
  staff: MockStaff[];
  products: MockProduct[];
  attendance: { staff: string; date: string; status: string }[];
}

function json(status: number, data: unknown) {
  return { status, contentType: 'application/json', body: JSON.stringify(data) };
}

/**
 * Wires every backend route the app calls to an in-memory, mutable store, so
 * create/edit/delete/status flows actually round-trip through a re-fetched
 * list the way they would against a real API — not just a static fixture.
 */
export async function mockApiRoutes(page: Page, seed?: Partial<MockDataStore>) {
  const store: MockDataStore = {
    staff: seed?.staff ?? [makeStaff()],
    products: seed?.products ?? [makeProduct()],
    attendance: seed?.attendance ?? [],
  };

  await page.route('**/api/v1/auth/login', (route) =>
    route.fulfill(json(200, { success: true, data: { accessToken: 'mock-access-token', user: mockUser } })),
  );
  await page.route('**/api/v1/auth/logout', (route) => route.fulfill(json(200, { success: true, data: null })));
  await page.route('**/api/v1/users/me', (route) => route.fulfill(json(200, { success: true, data: { user: mockUser } })));

  await page.route('**/api/v1/staff**', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const method = req.method();
    const match = url.pathname.match(/\/staff(?:\/([^/]+))?(\/[^/]+)?(\/[^/]+)?$/);
    const id = match?.[1];
    const subPath = [match?.[2], match?.[3]].filter(Boolean).join('');

    if (subPath.startsWith('/attendance')) {
      const staffId = id!;
      if (method === 'PUT') {
        const dateSegment = subPath.split('/')[2];
        const body = req.postDataJSON() as { status: string };
        const existing = store.attendance.find((a) => a.staff === staffId && a.date === dateSegment);
        if (existing) existing.status = body.status;
        else store.attendance.push({ staff: staffId, date: dateSegment, status: body.status });
        return route.fulfill(
          json(200, { success: true, data: { attendance: { status: body.status, staff: staffId, date: dateSegment } } }),
        );
      }
      const from = url.searchParams.get('from');
      const record = store.attendance.find((a) => a.staff === staffId && a.date === from);
      return route.fulfill(
        json(200, {
          success: true,
          data: { attendance: record ? [record] : [], pagination: { page: 1, limit: 1, total: record ? 1 : 0, totalPages: 1 } },
        }),
      );
    }

    if (!id && method === 'GET') {
      const search = (url.searchParams.get('search') || '').toLowerCase();
      const role = url.searchParams.get('role');
      const includeInactive = url.searchParams.get('includeInactive') === 'true';
      let list = store.staff.filter((s) => includeInactive || s.isActive);
      if (search) {
        list = list.filter(
          (s) => s.name.toLowerCase().includes(search) || s.email.toLowerCase().includes(search) || s.phone.includes(search),
        );
      }
      if (role) list = list.filter((s) => s.role === role);
      return route.fulfill(
        json(200, { success: true, data: { staff: list, pagination: { page: 1, limit: 100, total: list.length, totalPages: 1 } } }),
      );
    }

    if (!id && method === 'POST') {
      const body = req.postDataJSON();
      const created = makeStaff({ ...body, isActive: true });
      store.staff.unshift(created);
      return route.fulfill(json(201, { success: true, data: { staff: created } }));
    }

    if (id && subPath === '' && method === 'GET') {
      const staff = store.staff.find((s) => s.id === id);
      return staff
        ? route.fulfill(json(200, { success: true, data: { staff } }))
        : route.fulfill(json(404, { success: false, message: 'Staff member not found' }));
    }

    if (id && subPath === '' && method === 'PATCH') {
      const staff = store.staff.find((s) => s.id === id);
      if (!staff) return route.fulfill(json(404, { success: false, message: 'Staff member not found' }));
      Object.assign(staff, req.postDataJSON());
      return route.fulfill(json(200, { success: true, data: { staff } }));
    }

    if (id && subPath === '/deactivate' && method === 'PATCH') {
      const staff = store.staff.find((s) => s.id === id);
      if (staff) staff.isActive = false;
      return route.fulfill(json(200, { success: true, data: { staff } }));
    }

    if (id && subPath === '/activate' && method === 'PATCH') {
      const staff = store.staff.find((s) => s.id === id);
      if (staff) staff.isActive = true;
      return route.fulfill(json(200, { success: true, data: { staff } }));
    }

    if (id && subPath === '/role' && method === 'PATCH') {
      const staff = store.staff.find((s) => s.id === id);
      const body = req.postDataJSON() as { role: string };
      if (staff) staff.role = body.role;
      return route.fulfill(json(200, { success: true, data: { staff } }));
    }

    return route.fulfill(json(404, { success: false, message: 'Not found' }));
  });

  await page.route('**/api/v1/products**', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const method = req.method();

    if (url.pathname.endsWith('/categories')) {
      const categories = Array.from(new Set(store.products.map((p) => p.category)));
      return route.fulfill(json(200, { success: true, data: { categories } }));
    }

    if (url.pathname.endsWith('/status-summary')) {
      const counts = {
        all: store.products.length,
        active: store.products.filter((p) => p.status === 'active').length,
        inactive: store.products.filter((p) => p.status === 'inactive').length,
        draft: store.products.filter((p) => p.status === 'draft').length,
      };
      return route.fulfill(json(200, { success: true, data: { counts } }));
    }

    const match = url.pathname.match(/\/products(?:\/([^/]+))?(\/[^/]+)?$/);
    const id = match?.[1];
    const subPath = match?.[2] ?? '';

    if (!id && method === 'GET') {
      const search = (url.searchParams.get('search') || '').toLowerCase();
      const status = url.searchParams.get('status');
      let list = store.products;
      if (search) list = list.filter((p) => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search));
      if (status) list = list.filter((p) => p.status === status);
      return route.fulfill(
        json(200, { success: true, data: { products: list, pagination: { page: 1, limit: 100, total: list.length, totalPages: 1 } } }),
      );
    }

    if (!id && method === 'POST') {
      const body = req.postDataJSON();
      const created = makeProduct({ ...body, sku: `SKU-${Math.floor(Math.random() * 9000 + 1000)}` });
      store.products.unshift(created);
      return route.fulfill(json(201, { success: true, data: { product: created } }));
    }

    if (id && subPath === '' && method === 'PATCH') {
      const product = store.products.find((p) => p.id === id);
      if (!product) return route.fulfill(json(404, { success: false, message: 'Product not found' }));
      Object.assign(product, req.postDataJSON());
      return route.fulfill(json(200, { success: true, data: { product } }));
    }

    if (id && subPath === '' && method === 'DELETE') {
      store.products = store.products.filter((p) => p.id !== id);
      return route.fulfill(json(200, { success: true, data: null }));
    }

    if (id && subPath === '/adjustments' && method === 'POST') {
      const product = store.products.find((p) => p.id === id);
      const body = req.postDataJSON() as { delta: number; reason: string };
      if (product) {
        product.quantity += body.delta;
        product.isInStock = product.quantity > 0;
      }
      return route.fulfill(
        json(200, {
          success: true,
          data: {
            product,
            adjustment: { id: `adj-${Date.now()}`, delta: body.delta, reason: body.reason, quantityAfter: product?.quantity ?? 0 },
          },
        }),
      );
    }

    if (id && subPath === '/adjustments' && method === 'GET') {
      return route.fulfill(
        json(200, { success: true, data: { adjustments: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } } }),
      );
    }

    return route.fulfill(json(404, { success: false, message: 'Not found' }));
  });

  await page.route('**/api/v1/dashboard/**', async (route) => {
    const url = route.request().url();

    if (url.includes('/summary')) {
      return route.fulfill(
        json(200, {
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
      );
    }

    if (url.includes('/popular-dishes')) {
      const sortBy = new URL(url).searchParams.get('sortBy');
      return route.fulfill(
        json(200, {
          success: true,
          data: {
            dishes: [
              {
                productId: 'p-101',
                name: 'Mango Smoothie',
                price: 8.5,
                isInStock: true,
                quantitySold: 20,
                revenue: sortBy === 'revenue' ? 220 : 170,
              },
            ],
          },
        }),
      );
    }

    if (url.includes('/overview')) {
      const range = new URL(url).searchParams.get('range') || 'daily';
      return route.fulfill(
        json(200, {
          success: true,
          data: {
            range,
            series: [
              { period: 'Mon', sales: 120, revenue: 900 },
              { period: 'Tue', sales: 150, revenue: 1100 },
            ],
          },
        }),
      );
    }

    return route.fulfill(json(200, { success: true, data: {} }));
  });

  return store;
}

export async function login(page: Page, seed?: Partial<MockDataStore>) {
  const store = await mockApiRoutes(page, seed);
  await page.goto('/login');
  await page.getByLabel('Email Address').fill('admin@cosypos.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(/\/dashboard$/);
  return store;
}
