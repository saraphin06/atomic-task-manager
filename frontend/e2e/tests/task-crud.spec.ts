import { test, expect } from '@playwright/test';
import { TaskPage } from '../fixtures/task-page';

test.describe('Task CRUD', () => {
  test('user can create a new task and see it in the list', async ({ page }) => {
    const taskPage = new TaskPage(page);
    const taskTitle = `E2E Create ${Date.now()}`;

    await taskPage.createTask(taskTitle, 'Created by Playwright');

    await page.waitForURL('/tasks');

    const taskLink = page.getByRole('link', { name: taskTitle });
    await expect(taskLink).toBeVisible();
  });

  test('user can edit an existing task and see changes', async ({ page }) => {
    const taskPage = new TaskPage(page);
    const originalTitle = `E2E Modify ${Date.now()}`;
    const updatedTitle = `E2E Updated ${Date.now()}`;

    // Create a task first
    await taskPage.createTask(originalTitle, 'Original description');
    await page.waitForURL('/tasks');

    // Click Edit directly from the task row in the list
    const row = page.getByRole('row').filter({ hasText: originalTitle });
    await row.getByRole('link', { name: 'Edit' }).click();

    // Update the title
    const titleInput = page.getByLabel(/title/i);
    await titleInput.clear();
    await titleInput.fill(updatedTitle);
    await page.getByRole('button', { name: /update/i }).click();

    // Verify the change on detail page
    await expect(page.getByText(updatedTitle)).toBeVisible();
  });
});
