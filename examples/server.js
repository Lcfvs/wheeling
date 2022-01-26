import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import { readFile, watch } from 'fs/promises'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const app = fastify()
const path = fileURLToPath(import.meta.url)
const assets = resolve(path, `../assets`)
const js = resolve(assets, `./js`)

const home = await readFile(resolve(path, '../views/index.html'))

app.register(fastifyStatic, {
  prefix: '/assets/:subpath(.*)/',
  root: assets
})

app.get('/', async (request, reply) => {
  reply
    .status(200)
    .type('text/html')
    .send(home)
})

app.get('/hot', async (request, reply) => {
  const { raw } = reply

  const controller = new AbortController()

  const watcher = watch(js, {
    recursive: true,
    signal: controller.signal
  })

  raw.writeHead(200, {
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  })

  try {
    for await (const event of watcher) {
      const time = Date.now()

      raw.write(`data: /assets/${time}/js/app.js\n\n`)
    }
  } catch (error) {
    console.log(error)
  }
})

await app.listen(8080)
