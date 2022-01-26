import { app } from '../app.js'
import { watch } from 'fs/promises'
import { js } from '../paths.js'

const raws = new Set()

queueMicrotask(async () => {
  for await (const event of watcher) {
    const time = Date.now()

    for (const raw of raws) {
      raw.write(`data: /assets/${time}/js/app.js\n\n`)
    }
  }
})

const watcher = watch(js, {
  recursive: true
})

app.get('/hot', async (request, reply) => {
  const cleaner = () => raws.delete(reply.raw)

  request.raw.on('error', cleaner)
  request.raw.on('close', cleaner)
  raws.add(reply.raw)

  reply.raw.writeHead(200, {
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  })
})
