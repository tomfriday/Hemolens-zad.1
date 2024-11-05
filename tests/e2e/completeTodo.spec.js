const { test, expect } = require('@playwright/test')
import { TodoPage } from '../pages/TodoPage'
import testData from '../utils/testData.json'
import ApiHelper from '../utils/apiHelper'

// Przygotowanie danych testowych dla trzech zadań, które będą dodane jako nieukończone
const tasksForTests = [
  { ...testData.todos.NormalTasks.NormalTask1, completed: false },
  { ...testData.todos.NormalTasks.NormalTask2, completed: false },
  { ...testData.todos.NormalTasks.NormalTask3, completed: false },
]

test.beforeEach(async ({ request, baseURL, page }) => {
  const apiHelper = new ApiHelper(request, baseURL)

  // Oczyszczanie endpointu przed każdym testem
  await apiHelper.clearTodos()
  const todos = await apiHelper.getTodos()
  expect(todos).toEqual([])

  // Dodanie zadań testowych przez API jako nieukończone
  for (const task of tasksForTests) {
    await apiHelper.addTodo({ title: task.title, completed: task.completed })
  }

  // Otwarcie strony głównej i weryfikacja obecności nagłówka
  await page.goto('/')
  const header = page.locator('h1')
  await expect(header).toHaveText('todos')
})

test.describe('Marking tasks as complete', () => {
  // Oznaczanie pojedynczego zadania jako ukończone i weryfikacja
  test('should mark a single task as done and verify it is marked correctly', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)
    const taskToMark = tasksForTests[0]

    await todoPage.markTaskAsDone(taskToMark.title)
    const taskLocator = await todoPage.findTaskOnTheList(taskToMark.title)
    await expect(taskLocator).toHaveClass(/completed/)
    await expect(taskLocator).toBeVisible()
  })

  // Oznaczanie wielu zadań jako ukończone i weryfikacja
  test('should mark multiple tasks as done and verify they are marked correctly', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)

    for (const task of tasksForTests) {
      await todoPage.markTaskAsDone(task.title)
      const taskLocator = await todoPage.findTaskOnTheList(task.title)
      await expect(taskLocator).toHaveClass(/completed/)
      await expect(taskLocator).toBeVisible()
    }
  })

  // Oznaczanie i odznaczanie zadania kilkakrotnie, a następnie weryfikacja ostatecznego stanu
  test('should mark and unmark tasks multiple times and verify final state', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)

    for (const task of tasksForTests.slice(0, 2)) {
      await todoPage.markTaskAsDone(task.title)
      await todoPage.markTaskAsDone(task.title) // Odznaczenie
      await todoPage.markTaskAsDone(task.title) // Ponowne oznaczenie
      const taskLocator = await todoPage.findTaskOnTheList(task.title)
      await expect(taskLocator).toHaveClass(/completed/)
      await expect(taskLocator).toBeVisible()
    }
  })

  // Oznaczanie zadań, odświeżenie strony i weryfikacja, że stan został zachowany
  test('should mark some tasks as done, reload page, and verify persistence', async ({
    page,
    context,
  }) => {
    const todoPage = new TodoPage(page)

    await todoPage.markTaskAsDone(tasksForTests[0].title)
    await todoPage.markTaskAsDone(tasksForTests[1].title)

    // Weryfikacja stanu zadań przed odświeżeniem
    for (let i = 0; i < 2; i++) {
      const taskLocator = await todoPage.findTaskOnTheList(
        tasksForTests[i].title,
      )
      await expect(taskLocator).toHaveClass(/completed/)
      await expect(taskLocator).toBeVisible()
    }

    // Odświeżenie strony i ponowna weryfikacja
    await page.close()
    const newPage = await context.newPage()
    await newPage.goto('/')

    const newTodoPage = new TodoPage(newPage)

    for (let i = 0; i < 2; i++) {
      const taskLocator = await newTodoPage.findTaskOnTheList(
        tasksForTests[i].title,
      )
      await expect(taskLocator).toHaveClass(/completed/)
      await expect(taskLocator).toBeVisible()
    }

    // Weryfikacja, że trzecie zadanie pozostaje nieukończone
    const thirdTaskLocator = await newTodoPage.findTaskOnTheList(
      tasksForTests[2].title,
    )
    await expect(thirdTaskLocator).not.toHaveClass(/completed/)
    await expect(thirdTaskLocator).toBeVisible()
  })

  // Dodawanie ukończonego zadania przez API, weryfikacja jego stanu, a następnie odznaczenie
  test('should add a completed task via API, verify it is marked, then unmark it', async ({
    page,
    request,
    baseURL,
  }) => {
    const todoPage = new TodoPage(page)
    const completedTask = tasksForTests[0]
    const apiHelper = new ApiHelper(request, baseURL)

    // Dodanie zadania jako ukończonego przez API
    await apiHelper.addTodo({ title: completedTask.title, completed: true })
    await page.goto('/')

    // Weryfikacja, że zadanie jest oznaczone jako ukończone
    const taskLocator = await todoPage.findTaskOnTheList(completedTask.title)
    await expect(taskLocator).toHaveClass(/completed/)
    await expect(taskLocator).toBeVisible()

    // Odznaczenie zadania
    await todoPage.markTaskAsDone(completedTask.title)

    // Ponowne załadowanie zadań przez API i weryfikacja, że zadanie jest nieukończone
    await page.reload()
    const updatedTodos = await apiHelper.getTodos()
    const taskStatus = updatedTodos.find(
      (todo) => todo.title === completedTask.title,
    )
    expect(taskStatus.completed).toBe(false)
  })
})

test.afterAll(async ({ request, baseURL }) => {
  const apiHelper = new ApiHelper(request, baseURL)
  await apiHelper.clearTodos()
  const todosAfterClear = await apiHelper.getTodos()
  expect(todosAfterClear).toEqual([])
})
