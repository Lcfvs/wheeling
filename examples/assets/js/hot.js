import { init } from './wheeling.js'
import message from './listeners/message.js'
import app from './app.js'
import './main.js'

const { EventSource, location } = globalThis

let current = app
let promise
let resolve
let timestamp = Date.now() + 100

const hot = init()

const load = async src => (await import(src)).default

const pick = resolver => resolve = resolver

export const pause = () => {
  if (!promise) {
    promise = new Promise(pick)
  }
}

export const resume = () => resolve?.()

hot.add([
  hot.listen(new EventSource('/hot'), message, async ({ event }) => {
    const now = Date.now()

    await promise

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
