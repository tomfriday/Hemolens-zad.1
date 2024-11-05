export class TodoPage {
  constructor(page) {
    this.page = page
  }

  async addTask(taskName) {
    await this.page.fill('[data-testid="taskInput"]', taskName)
    await this.page.press('[data-testid="taskInput"]', 'Enter')
  }

  async markTaskAsDone(taskName) {
    const taskLocator = this.page.locator(
      `[data-testid="task"]:has-text("${taskName}")`,
    )

    await taskLocator.locator('[data-testid="markAsDone"]').click()
  }

  async deleteTask(taskName) {
    const taskLocator = this.page.locator(
      `[data-testid="task"]:has-text("${taskName}")`,
    )

    await taskLocator.hover()
    await taskLocator.locator('[data-testid="deleteTask"]').click()
  }

  async findTaskOnTheList(taskName) {
    const taskList = this.page.locator('[data-testid="taskList"]')
    const taskLocator = taskList.locator(
      `[data-testid="task"]:has-text("${taskName}")`,
    )

    return taskLocator
  }
  async getTaskTextByIndex(index) {
    return this.page.locator('[data-testid="task"]').nth(index).textContent()
  }
  getMarkAsDoneButton(taskName) {
    return this.page.locator(
      `[data-testid="task"]:has(label:has-text("${taskName}")) >> [data-testid="markAsDone"]`,
    )
  }
}
