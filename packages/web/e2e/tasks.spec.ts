import { test, expect } from '@playwright/test';


test.describe('Task Manager', () => {
  test('user can create a task and see it in the list', async ({ page }) => {
    await page.goto('/');

    
    await page.click('[data-testid="new-task-btn"]');

    
    await page.fill('[data-testid="task-title-input"]', 'Review PR #42');

   
    await page.click('[data-testid="task-submit-btn"]');

    
    await expect(page.locator('text=Review PR #42')).toBeVisible();
  });

  test('user can delete a task', async ({ page }) => {
    await page.goto('/');

   
    await page.click('[data-testid="new-task-btn"]');
    await page.fill('[data-testid="task-title-input"]', 'Task to delete');
    await page.click('[data-testid="task-submit-btn"]');

   
    await expect(page.locator('text=Task to delete')).toBeVisible();
 
    await page.locator('[data-testid^="delete-task-"]').first().click();

    
    await page.click('[data-testid="confirm-delete-btn"]');

    
    await expect(page.locator('text=Task to delete')).not.toBeVisible();
  });
});
