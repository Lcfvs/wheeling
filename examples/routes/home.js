import { app } from '../app.js'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { path } from '../paths.js'

const home = await readFile(resolve(path, '../views/index.html'))

app.get('/', async (request, reply) => {
  reply
    .status(200)
    .type('text/html')
    .send(home)
})
