import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
  #database = {
    tasks: []
  }

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  insert(table, data) {
    this.#database[table].push({
      id: randomUUID(),
      title: data.title,
      description: data.description,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    this.#persist()
    return data
  }

  select(table, search) {
    let data = this.#database[table] ?? []
    if (search) {
      data = data.filter(row => {
        const titleFiltered = row.title.toLowerCase().includes(search.toLowerCase())
        const descriptionFiltered = row.description.toLowerCase().includes(search.toLowerCase())
        return titleFiltered || descriptionFiltered
      })
    }
    return data
  }

  findById(table, id) {
    const data = this.#database[table].find(row => row.id === id)
    if (data) {
      return data
    }
    return null
  }

  update(table, id, data) {
    const index = this.#database[table].findIndex(row => row.id === id)
    if (index > -1) {
      const oldTask = this.#database[table][index]
      const newTask = {
        id,
        title: data.title ?? oldTask.title,
        description: data.description ?? oldTask.description,
        completed_at: oldTask.completed_at,
        created_at: oldTask.created_at,
        updated_at: oldTask.updated_at,
      }
      this.#database[table][index] = newTask
      this.#persist()
      return this.#database[table][index]
    }
    return null
  }

  delete(table, id) {
    const index = this.#database[table].findIndex(row => row.id === id)
    if (index > -1) {
      this.#database[table].splice(index, 1)
      this.#persist()
    }
  }
}
