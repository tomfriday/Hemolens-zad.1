const { test, expect } = require('@playwright/test')
import { TodoPage } from '../pages/TodoPage'
import testData from '../utils/testData.json'
import ApiHelper from '../utils/apiHelper'

// Definiowanie danych testowych dla różnych typów zadań
const longTask = testData.todos.longTask.title
const shortTask = testData.todos.shortTask.title
const numericTask = testData.todos.numericTask.title
const specialCharsTask = testData.todos.specialCharsTask.title
const normalTasksArray = Object.values(testData.todos.NormalTasks)

test.beforeEach(async ({ request, baseURL, page }) => {
  const apiHelper = new ApiHelper(request, baseURL)

  // Usuwanie wszystkich zadań przed każdym przypadkiem testowym
  await apiHelper.clearTodos()
  const todos = await apiHelper.getTodos()
  expect(todos).toEqual([])

  // Otwieranie strony głównej aplikacji
  await page.goto('/')
  const header = page.locator('h1')
  await expect(header).toHaveText('todos')
})

test.describe('Adding various types of tasks', () => {
  test('should add a task with a long name and verify its visibility', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)
    // Dodaje zadanie o długiej nazwie
    await todoPage.addTask(longTask)
    // Sprawdzam, czy zadanie jest widoczne
    const taskLocator = await todoPage.findTaskOnTheList(longTask)
    await expect(taskLocator).toBeVisible()
    // Sprawdzam, czy przycisk oznaczania zadania jest widoczny i że zadanie nie jest oznaczone jako ukończone
    const checkButton = todoPage.getMarkAsDoneButton(longTask)
    await expect(checkButton).toBeVisible()
    await expect(taskLocator).not.toHaveClass(/completed/)
  })

  test('should add a task with a short name and verify visibility', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)
    // Dodaje zadanie o krótkiej nazwie
    await todoPage.addTask(shortTask)
    // Sprawdzam, czy zadanie jest widoczne
    const taskLocator = await todoPage.findTaskOnTheList(shortTask)
    await expect(taskLocator).toBeVisible()
    // Sprawdzam przycisk oznaczania zadania i że zadanie nie jest oznaczone jako ukończone
    const checkButton = todoPage.getMarkAsDoneButton(shortTask)
    await expect(checkButton).toBeVisible()
    await expect(taskLocator).not.toHaveClass(/completed/)
  })

  test('should add a task with special characters and verify visibility', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)
    // Dodaje zadanie ze specjalnymi znakami
    await todoPage.addTask(specialCharsTask)
    // Sprawdzam, czy zadanie jest widoczne
    const taskLocator = await todoPage.findTaskOnTheList(specialCharsTask)
    await expect(taskLocator).toBeVisible()
    // Sprawdzam przycisk oznaczania zadania i że zadanie nie jest oznaczone jako ukończone
    const checkButton = todoPage.getMarkAsDoneButton(specialCharsTask)
    await expect(checkButton).toBeVisible()
    await expect(taskLocator).not.toHaveClass(/completed/)
  })

  test('should add a task with numeric name and verify visibility', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)
    // Dodaje zadanie z nazwą zawierającą liczby
    await todoPage.addTask(numericTask)
    // Sprawdzam, czy zadanie jest widoczne
    const taskLocator = await todoPage.findTaskOnTheList(numericTask)
    await expect(taskLocator).toBeVisible()
    // Sprawdzam przycisk oznaczania zadania i że zadanie nie jest oznaczone jako ukończone
    const checkButton = todoPage.getMarkAsDoneButton(numericTask)
    await expect(checkButton).toBeVisible()
    await expect(taskLocator).not.toHaveClass(/completed/)
  })

  test('should add multiple tasks in the correct order and verify visibility', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)
    const tasks = [shortTask, specialCharsTask, numericTask]

    // Dodaje kilka zadań w odpowiedniej kolejności
    for (const task of tasks) {
      await todoPage.addTask(task)
      const checkButton = todoPage.getMarkAsDoneButton(task)
      await expect(checkButton).toBeVisible()
    }

    // Sprawdzam, czy zadania są widoczne i nie są ukończone
    for (const task of tasks) {
      const taskLocator = await todoPage.findTaskOnTheList(task)
      await expect(taskLocator).not.toHaveClass(/completed/)
    }

    // Sprawdzam, czy zadania są w tej samej kolejności
    for (let i = 0; i < tasks.length; i++) {
      const taskLocator = await todoPage.findTaskOnTheList(tasks[i])
      await expect(taskLocator).toBeVisible()
      expect((await todoPage.getTaskTextByIndex(i)).trim()).toBe(tasks[i])
    }
  })

  test('should add the same task twice and verify both are visible', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)
    // Dodaje dwa razy to samo zadanie
    await todoPage.addTask(shortTask)
    await todoPage.addTask(shortTask)

    // Sprawdzam, czy oba wystąpienia zadania są widoczne
    expect((await todoPage.getTaskTextByIndex(0)).trim()).toBe(shortTask)
    expect((await todoPage.getTaskTextByIndex(1)).trim()).toBe(shortTask)

    const checkButtons = await todoPage.getMarkAsDoneButton(shortTask)
    expect(await checkButtons.count()).toBe(2)
    await expect(checkButtons.nth(0)).toBeVisible()
    await expect(checkButtons.nth(1)).toBeVisible()
  })

  test('should add all normal tasks and verify their visibility and order', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)

    // Dodaje wszystkie normalne zadania z pliku danych testowych
    for (const task of normalTasksArray) {
      await todoPage.addTask(task.title)
      const taskLocator = await todoPage.findTaskOnTheList(task.title)
      await expect(taskLocator).toBeVisible()
    }

    // Sprawdzam, czy zadania są widoczne w poprawnej kolejności
    for (let i = 0; i < normalTasksArray.length; i++) {
      const taskTitle = normalTasksArray[i].title
      const taskLocator = await todoPage.findTaskOnTheList(taskTitle)
      await expect(taskLocator).toBeVisible()
      expect((await todoPage.getTaskTextByIndex(i)).trim()).toBe(taskTitle)
    }
  })
})

test.afterAll(async ({ request, baseURL }) => {
  const apiHelper = new ApiHelper(request, baseURL)
  await apiHelper.clearTodos()
  const todosAfterClear = await apiHelper.getTodos()
  expect(todosAfterClear).toEqual([])
})
