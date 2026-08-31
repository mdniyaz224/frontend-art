import { test, expect } from '@playwright/test';
import { login, makeStaff } from './mocks';

test.describe('Staff', () => {
  test('list loads with the expected columns and no ID column', async ({ page }) => {
    await login(page, { staff: [makeStaff({ name: 'Alice Johnson' })] });
    await page.goto('/staff');

    await expect(page.getByRole('heading', { name: 'Staff (1)' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Staff' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'ID', exact: true })).toHaveCount(0);
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByText('Alice Johnson')).toBeVisible();
  });

  test('search filters the staff list', async ({ page }) => {
    await login(page, {
      staff: [makeStaff({ name: 'Alice Johnson', email: 'alice@cosypos.com' }), makeStaff({ name: 'Bob Carter', email: 'bob@cosypos.com' })],
    });
    await page.goto('/staff');
    await expect(page.getByText('Bob Carter')).toBeVisible();

    await page.getByPlaceholder('Search by name, email, or phone').fill('Alice');
    await expect(page.getByText('Bob Carter')).not.toBeVisible();
    await expect(page.getByText('Alice Johnson')).toBeVisible();
  });

  test('role filter narrows the staff list', async ({ page }) => {
    await login(page, {
      staff: [makeStaff({ name: 'Alice Manager', role: 'manager' }), makeStaff({ name: 'Cara Cashier', role: 'cashier' })],
    });
    await page.goto('/staff');
    await expect(page.getByText('Cara Cashier')).toBeVisible();

    await page.getByLabel('All roles').click();
    await page.getByRole('option', { name: 'Manager' }).click();

    await expect(page.getByText('Cara Cashier')).not.toBeVisible();
    await expect(page.getByText('Alice Manager')).toBeVisible();
  });

  test('creates a new staff member', async ({ page }) => {
    await login(page, { staff: [] });
    await page.goto('/staff');

    await page.getByRole('button', { name: 'Add Staff' }).click();
    await page.getByLabel('Full Name').fill('New Hire');
    await page.getByLabel('Email').fill('newhire@cosypos.com');
    await page.getByLabel('Password').fill('Str0ng!Pass1');
    await page.locator('#role').click();
    await page.getByRole('option', { name: 'Cashier' }).click();
    await page.getByLabel('Phone number').fill('5550199');
    await page.getByLabel('Salary').fill('35000');
    // MUI's masked date/time inputs need a real click to initialize the mask
    // before typing, and a per-keystroke delay — typing too fast can outrun
    // React's state updates and silently drop the first characters.
    const dobField = page.getByLabel('Date of birth');
    await dobField.click();
    await dobField.pressSequentially('01/01/2000', { delay: 50 });

    const shiftStartField = page.getByLabel('Shift start timing');
    await shiftStartField.click();
    await shiftStartField.pressSequentially('0900AM', { delay: 50 });

    const shiftEndField = page.getByLabel('Shift end timing');
    await shiftEndField.click();
    await shiftEndField.pressSequentially('0500PM', { delay: 50 });

    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect(page.getByText('New Hire')).toBeVisible();
    await expect(page.getByText('newhire@cosypos.com')).toBeVisible();
  });

  test('edits an existing staff member', async ({ page }) => {
    await login(page, { staff: [makeStaff({ name: 'Alice Johnson', salary: 42000 })] });
    await page.goto('/staff');

    await page.locator('tbody tr').first().getByRole('button').nth(1).click(); // edit icon
    const salaryField = page.getByLabel('Salary');
    await salaryField.fill('50000');
    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect(page.getByText('$50,000.00')).toBeVisible();
  });

  test('navigates to staff detail and back', async ({ page }) => {
    const staff = makeStaff({ name: 'Alice Johnson' });
    await login(page, { staff: [staff] });
    await page.goto('/staff');

    await page.locator('tbody tr').first().getByRole('button').first().click(); // view icon
    await expect(page).toHaveURL(new RegExp(`/staff/${staff.id}$`));
    await expect(page.getByRole('heading', { name: 'Alice Johnson' })).toBeVisible();

    await page.locator('header button').first().click(); // back chevron
    await expect(page).toHaveURL(/\/staff$/);
  });

  test('deactivates a staff member', async ({ page }) => {
    await login(page, { staff: [makeStaff({ name: 'Alice Johnson', isActive: true })] });
    await page.goto('/staff');

    await page.locator('tbody tr').first().getByRole('button').last().click(); // deactivate icon
    await page.getByRole('button', { name: 'Deactivate' }).click();

    await expect(page.getByText('Alice Johnson')).not.toBeVisible();

    await page.getByLabel('Show inactive').click();
    await expect(page.getByText('Alice Johnson')).toBeVisible();
  });

  test('marks attendance for a staff member', async ({ page }) => {
    await login(page, { staff: [makeStaff({ name: 'Alice Johnson' })] });
    await page.goto('/staff');
    await page.getByRole('button', { name: 'Attendance' }).click();

    await page.getByRole('button', { name: 'Present' }).click();

    // Marking success collapses the four status options into one label+edit button.
    await expect(page.getByRole('button', { name: 'Absent' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Present' })).toBeVisible();
  });
});
