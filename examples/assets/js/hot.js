import add from 'wheeling/add'
import init from 'wheeling/init'
import listen from 'wheeling/listen'
import revoke from 'wheeling/revoke'
import task from 'wheeling/task'
import passive from 'wheeling/options/passive'
import { app } from './app.js'
import './main.js'

const { EventSource, location } = globalThis

let current = app
let promise
let resolve
let timestamp = Date.now() + 100

const hot = init()

const pick = resolver => resolve = resolver

const onMessage = listen(hot, new EventSource('/hot'), {
  type: 'message',
  passive
})

export const pause = () => {
  if (!promise) {
    promise = new Promise(pick)
  }
}

export const resume = () => resolve?.()

add(hot, [
  task(hot, onMessage, async ({ event }) => {
    const now = Date.now()

    await promise

    if (now > timestamp) {
      timestamp = now + 100

      const previous = current
      const { data } = event
      const app = new URL(data, location)
      const main = new URL('main.js', app)

      current = (await import(main)).app
      revoke(previous)
      await import(main)
    }
  })
])
