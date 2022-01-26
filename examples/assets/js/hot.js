import { init } from './wheeling.js'
import message from './listeners/message.js'
import app from './app.js'
import './main.js'

const { EventSource, location } = globalThis

const hot = init()

const load = async src => (await import(src)).default

let current = app
let timestamp = Date.now() + 100

hot.add([
  hot.listen(new EventSource('/hot'), message, async ({ event }) => {
    const now = Date.now()

    if (now > timestamp) {
      timestamp = now + 100

      const previous = current
      const { data } = event
      const app = new URL(data, location)
      const main = new URL('main.js', app)

      current = await load(app)
      previous.revoke()
      await import(main)
    }
  })
])

