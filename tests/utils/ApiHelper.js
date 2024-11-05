class ApiHelper {
  constructor(request, baseURL) {
    this.request = request
    this.baseURL = baseURL
    this.todosEndpoint = `${baseURL}/todos`
  }

  async clearTodos(endpoint = this.todosEndpoint) {
    const response = await this.request.get(endpoint)
    const todos = await response.json()
    if (todos.length > 0) {
      for (const todo of todos) {
        // dodaje opoźnienie, ze wztgledu na problemy z error connecition problems
        await new Promise((resolve) => setTimeout(resolve, 300))
        await this.deleteTodoById(todo.id) // Usuwanie każdego zadania po ID
      }
      console.log('Endpoint cleaned up.')
    }
  }

  async addTodo(task) {
    return this.request.post(this.todosEndpoint, {
      data: { title: task.title, completed: task.completed || false },
    })
  }

  async getTodos(endpoint = this.todosEndpoint) {
    const response = await this.request.get(endpoint)
    return response.json()
  }

  async updateTodo(id, updatedData) {
    return this.request.patch(`${this.todosEndpoint}/${id}`, {
      data: updatedData,
    })
  }

  async deleteTodoById(id) {
    return this.request.delete(`${this.todosEndpoint}/${id}`)
  }
}

export default ApiHelper
