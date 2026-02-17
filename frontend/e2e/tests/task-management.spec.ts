import { test, expect } from '@playwright/test';
import { TaskPage } from '../fixtures/task-page';

test.describe('Task Management', () => {
  test('user can toggle task completion from the list', async ({ page }) => {
    const taskPage = new TaskPage(page);
    const taskTitle = `E2E Toggle ${Date.now()}`;

    await taskPage.createTask(taskTitle);
    await page.waitForURL('/tasks');

    // Toggle the checkbox - scope to the row containing our task
    const row = page.getByRole('row').filter({ hasText: taskTitle });
    await row.getByRole('checkbox').click();

    // Verify it shows as completed
    await expect(row.getByText('Done')).toBeVisible();
  });

  test('user can delete a task with confirmation', async ({ page }) => {
    const taskPage = new TaskPage(page);
    const taskTitle = `E2E Delete ${Date.now()}`;

    await taskPage.createTask(taskTitle);
    await page.waitForURL('/tasks');

    // Click delete on the specific row
    const row = page.getByRole('row').filter({ hasText: taskTitle });
    await row.getByRole('button', { name: /delete/i }).click();

    // Confirm deletion
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /delete/i }).click();

    // Verify the task is gone
    await expect(page.getByText(taskTitle)).not.toBeVisible();
  });
});
