import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { title, description } = request.body
      database.insert('tasks', { title, description })
      return response.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { search } = request.query
      const data = database.select('tasks', search)
      return response.end(JSON.stringify(data))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params
      const { title, description } = request.body
      const taskExist = database.findById('tasks', id)
      if (taskExist === null) {
        return response.writeHead(404).end()
      }
      const data = database.update('tasks', id, { title, description })
      return response.end(JSON.stringify(data))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params
      const taskExist = database.findById('tasks', id)
      if (taskExist === null) {
        return response.writeHead(404).end()
      }
      database.delete('tasks', id)
      return response.writeHead(204).end()
    }
  },
]
