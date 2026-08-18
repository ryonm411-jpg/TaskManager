import { test, expect } from '@playwright/test';


test.describe('Task Manager', () => {
  test('user can create a task and see it in the list', async ({ page }) => {
    const title = `Review PR #${Date.now()}`;
    await page.goto('/');

    await page.click('[data-testid="new-task-btn"]');
    await page.fill('[data-testid="task-title-input"]', title);
    await page.click('[data-testid="task-submit-btn"]');

    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  });

  test('user can delete a task', async ({ page }) => {
    const title = `Task to delete ${Date.now()}`;
    await page.goto('/');

    await page.click('[data-testid="new-task-btn"]');
    await page.fill('[data-testid="task-title-input"]', title);
    await page.click('[data-testid="task-submit-btn"]');

    const taskHeading = page.getByRole('heading', { name: title });
    await expect(taskHeading).toBeVisible();

    // Click the delete button specifically on the card for this created task
    const taskCard = page.locator('[data-testid^="task-card-"]', { has: taskHeading });
    await taskCard.locator('[data-testid^="delete-task-"]').click();

    await page.click('[data-testid="confirm-delete-btn"]');

    await expect(taskHeading).not.toBeVisible();
  });
});
