const { test, expect } = require('@playwright/test')
import { TodoPage } from '../pages/TodoPage'
import testData from '../utils/testData.json'
import ApiHelper from '../utils/apiHelper'

// Definiowanie danych testowych dla usuwania zadań
const tasksForTests = [
  { ...testData.todos.NormalTasks.NormalTask4, completed: true },
  { ...testData.todos.NormalTasks.NormalTask5, completed: false },
  { ...testData.todos.NormalTasks.NormalTask6, completed: false },
]

test.beforeEach(async ({ request, baseURL, page }) => {
  const apiHelper = new ApiHelper(request, baseURL)
  await apiHelper.clearTodos()
  const todos = await apiHelper.getTodos()
  expect(todos).toEqual([])

  for (const task of tasksForTests) {
    // Dodaję zadania z odpowiednim 'stanem ukończenia'
    await apiHelper.addTodo({
      title: task.title,
      completed: task.completed,
    })
  }

  await page.goto('/')
  const header = page.locator('h1')
  await expect(header).toHaveText('todos')
})

test.describe('Deleting tasks', () => {
  test('should delete a completed task and verify it is removed', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)
    const completedTask = tasksForTests[0]

    // Usuwam ukończone zadanie
    await todoPage.deleteTask(completedTask.title)

    // Weryfikuję, że zadanie zostało usunięte
    const taskLocator = await todoPage.findTaskOnTheList(completedTask.title)
    await expect(taskLocator).not.toBeVisible()
  })

  test('should delete an uncompleted task and verify it is removed', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)
    const uncompletedTask = tasksForTests[1]

    // Usuwam nieukończone zadanie
    await todoPage.deleteTask(uncompletedTask.title)
    const taskLocator = await todoPage.findTaskOnTheList(uncompletedTask.title)
    await expect(taskLocator).not.toBeVisible()
  })

  test('should delete all tasks and verify removal with specific completion states', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page)

    // Usuwam wszystkie zadania i sprawdzam, że są niewidoczne
    for (const task of tasksForTests) {
      await todoPage.deleteTask(task.title)
      const taskLocator = await todoPage.findTaskOnTheList(task.title)
      await expect(taskLocator).not.toBeVisible()
    }
  })

  test('should delete a task, refresh the page, and verify it is removed', async ({
    page,
    context,
  }) => {
    const todoPage = new TodoPage(page)
    const taskToDelete = tasksForTests[2]

    // Usuwam zadanie, odświeżam stronę i sprawdzam, czy zadanie nadal jest usunięte
    await todoPage.deleteTask(taskToDelete.title)

    await page.close()
    const newPage = await context.newPage()
    await newPage.goto('/')

    const newTodoPage = new TodoPage(newPage)
    const taskLocator = await newTodoPage.findTaskOnTheList(taskToDelete.title)
    await expect(taskLocator).not.toBeVisible()
  })

  test('should delete a task and verify its removal using API', async ({
    page,
    request,
    baseURL,
  }) => {
    const todoPage = new TodoPage(page)
    const taskToDelete = tasksForTests[0]

    // Usuwam zadanie przez UI
    await todoPage.deleteTask(taskToDelete.title)

    // Weryfikuję usunięcie zadania przez API
    const apiHelper = new ApiHelper(request, baseURL)
    const updatedTodos = await apiHelper.getTodos()
    const taskStatus = updatedTodos.find(
      (todo) => todo.title === taskToDelete.title,
    )
    expect(taskStatus).toBeUndefined()
  })
})

test.afterAll(async ({ request, baseURL }) => {
  const apiHelper = new ApiHelper(request, baseURL)
  await apiHelper.clearTodos()
  const todosAfterClear = await apiHelper.getTodos()
  expect(todosAfterClear).toEqual([])
})
