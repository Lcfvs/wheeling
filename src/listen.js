/**
 * @module wheeling/listen
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling/blob/master/src/listen.js
 */

import { resolvable, resolver } from './internals/promise.js'
import wrap from './internals/wrap.js'
import io from './io.js'

const apps = new WeakMap()

const handleEvent = async function (event) {
  const { forget, hooks, input, options } = this
  const { once } = options
  const target = event.currentTarget ?? event.target
  const promise = resolvable()
  let returned

  for (const hook of hooks) {
    returned = hook(event, promise) ?? returned
  }

  if (once) {
    forget()
  }

  if (returned !== promise) {
    await input.next({ event, target })

    return
  }

  const [resolve, reject] = resolver(promise)

  await input.next({ event, resolve, reject, target })
}

/**
 * @param {app} app
 * @param {EventTarget} target
 * @param {listener} listener
 * @throws {ReferenceError}
 */
export default wrap(async function* (app, target, listener) {
  if (!apps.has(app)) {
    apps.set(app, new WeakMap())
  }

  const listeners = apps.get(app)

  if (!listeners.has(target)) {
    listeners.set(target, new WeakMap())
  }

  const handlers = listeners.get(target)

  if (handlers.has(listener)) {
    throw new Error('Duplicate event listening')
  }

  const { hooks: [...hooks] = [], type, ...options } = listener
  const ref = new WeakRef(target)
  const [input, output] = io(app)
  const forget = () => {
    ref.deref()?.removeEventListener(type, handler, options)
    handlers.delete(listener)
    input.return()
  }
  const registry = new FinalizationRegistry(forget)
  const handler = { forget, input, handleEvent, hooks, options }

  registry.register(target, null)
  handlers.set(listener, handler)
  target.addEventListener(type, handler, options)

  try {
    yield * output
  } finally {
    forget()
  }
})
