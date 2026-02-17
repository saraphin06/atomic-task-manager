import { type Page, type Locator } from '@playwright/test';

export class TaskPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly dueDateInput: Locator;
  readonly assignedToInput: Locator;
  readonly submitButton: Locator;
  readonly taskTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByLabel(/title/i);
    this.descriptionInput = page.getByLabel(/description/i);
    this.dueDateInput = page.getByLabel(/due date/i);
    this.assignedToInput = page.getByLabel(/assigned to/i);
    this.submitButton = page.getByRole('button', { name: /save|create|update/i });
    this.taskTable = page.locator('table');
  }

  async goto() {
    await this.page.goto('/tasks');
  }

  async gotoCreate() {
    await this.page.goto('/tasks/new');
  }

  async createTask(title: string, description?: string) {
    await this.gotoCreate();
    await this.titleInput.fill(title);
    if (description) {
      await this.descriptionInput.fill(description);
    }
    await this.submitButton.click();
  }

  async getTaskRowByTitle(title: string) {
    return this.page.getByRole('link', { name: title });
  }
}
