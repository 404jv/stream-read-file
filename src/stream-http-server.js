import http from 'node:http'
import fs from 'node:fs'
import { parse } from 'csv-parse';

const server = http.createServer((request, response) => {
  fs.createReadStream('data.csv')
    .pipe(parse())
    .on('data', async (data) => {
      if (data[0] === 'title' && data[1] === 'description') {
        return
      }
      await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: data[0],
          description: data[1]
        })
      })
    })
    .on('end', () => {
      console.log('✅ Arquivo lido com sucesso!')
    })
})

server.listen(3334)
