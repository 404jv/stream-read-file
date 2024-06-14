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
}
