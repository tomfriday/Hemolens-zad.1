const { test, expect } = require('@playwright/test')
import testData from '../utils/testData.json'
import ApiHelper from '../utils/apiHelper'

// Definiowanie danych testowych dla różnych przypadków testowych
const tasksForTests = [
  { ...testData.todos.NormalTasks.NormalTask7, completed: false },
  { ...testData.todos.NormalTasks.NormalTask8, completed: false },
  { ...testData.todos.NormalTasks.NormalTask9, completed: false },
]

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

test.describe('API Tests for ToDo Application', () => {
  test('should add a new task via API and verify it exists', async ({
    request,
    baseURL,
  }) => {
    const apiHelper = new ApiHelper(request, baseURL)
    const newTask = tasksForTests[0]

    // Dodaję zadanie poprzez API
    const addResponse = await apiHelper.addTodo({
      title: newTask.title,
      completed: newTask.completed,
    })
    expect(addResponse.ok()).toBeTruthy()

    // Weryfikuję, czy zadanie zostało dodane
    const tasks = await apiHelper.getTodos()
    const addedTask = tasks.find((task) => task.title === newTask.title)
    expect(addedTask).toBeDefined()
    expect(addedTask.completed).toBe(newTask.completed)
  })

  test('should mark a task as completed via API and verify its status', async ({
    request,
    baseURL,
  }) => {
    const apiHelper = new ApiHelper(request, baseURL)
    const taskToComplete = tasksForTests[1]

    // Dodaję zadanie przez API z ustawieniem jako nieukończone
    const addResponse = await apiHelper.addTodo({
      title: taskToComplete.title,
      completed: false,
    })
    expect(addResponse.ok()).toBeTruthy()

    // Aktualizuję zadanie, oznaczając je jako ukończone
    const tasks = await apiHelper.getTodos()
    const addedTask = tasks.find((task) => task.title === taskToComplete.title)
    const completeResponse = await apiHelper.updateTodo(addedTask.id, {
      completed: true,
    })
    expect(completeResponse.ok()).toBeTruthy()

    // Weryfikuję, że zadanie jest oznaczone jako ukończone
    const updatedTasks = await apiHelper.getTodos()
    const completedTask = updatedTasks.find((task) => task.id === addedTask.id)
    expect(completedTask.completed).toBe(true)
  })

  test('should delete a task via API and verify it no longer exists', async ({
    request,
    baseURL,
  }) => {
    const apiHelper = new ApiHelper(request, baseURL)
    const taskToDelete = tasksForTests[2]

    // Dodaję zadanie przez API
    const addResponse = await apiHelper.addTodo({
      title: taskToDelete.title,
      completed: false,
    })
    expect(addResponse.ok()).toBeTruthy()

    // Usuwam zadanie przez API
    const tasks = await apiHelper.getTodos()
    const addedTask = tasks.find((task) => task.title === taskToDelete.title)
    const deleteResponse = await apiHelper.deleteTodoById(addedTask.id)
    expect(deleteResponse.ok()).toBeTruthy()

    // Weryfikuję, że zadanie zostało usunięte
    const updatedTasks = await apiHelper.getTodos()
    const deletedTask = updatedTasks.find((task) => task.id === addedTask.id)
    expect(deletedTask).toBeUndefined()
  })

  test('should add, mark as complete, and delete a task sequentially via API', async ({
    request,
    baseURL,
  }) => {
    const apiHelper = new ApiHelper(request, baseURL)
    const taskSequence = tasksForTests[0]

    // Dodaję zadanie, oznaczam jako ukończone, a następnie usuwam
    const addResponse = await apiHelper.addTodo({
      title: taskSequence.title,
      completed: false,
    })
    expect(addResponse.ok()).toBeTruthy()

    const tasks = await apiHelper.getTodos()
    const addedTask = tasks.find((task) => task.title === taskSequence.title)

    // Oznaczam zadanie jako ukończone
    const completeResponse = await apiHelper.updateTodo(addedTask.id, {
      completed: true,
    })
    expect(completeResponse.ok()).toBeTruthy()

    // Usuwam zadanie
    const deleteResponse = await apiHelper.deleteTodoById(addedTask.id)
    expect(deleteResponse.ok()).toBeTruthy()

    // Weryfikuję, że zadanie zostało usunięte
    const updatedTasks = await apiHelper.getTodos()
    const deletedTask = updatedTasks.find((task) => task.id === addedTask.id)
    expect(deletedTask).toBeUndefined()
  })
})

test.afterAll(async ({ request, baseURL }) => {
  const apiHelper = new ApiHelper(request, baseURL)
  await apiHelper.clearTodos()
  const todosAfterClear = await apiHelper.getTodos()
  expect(todosAfterClear).toEqual([])
})
