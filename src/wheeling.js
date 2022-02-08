/**
 * @module wheeling/wheeling.js
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling
 */

import { cast, handleEvent, iterate, readable, writable } from './internals/core.js'
import { reject, resolvable } from './internals/promise.js'

const apps = new WeakMap()

const add = (app, [...iterables]) => {
  for (const iterable of iterables) {
    queueMicrotask(async () => {
      for await (const value of iterable) {}
    })
  }
}

const fork = (app, iterable, length = 2) => {
  const iterables = []
  const keys = new Set(Array.from({ length }, Object))
  const promises = new WeakMap()
  const reader = cast(iterable)

  for (const key of keys) {
    promises.set(key, [])
    iterables.push(iterate(app, promises, keys, key, reader))
  }

  return iterables
}

const init = () => {
  const app = resolvable()

  apps.set(app, new WeakMap())

  return app
}

const io = app => {
  const promises = [resolvable(), resolvable()]
  const input = writable(app, promises)
  const output = readable(app, promises)

  input.next()

  return [input, output]
}

const listen = async function* (app, target, listener) {
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
}

const task = async function* (app, iterable, task) {
  const [iterator] = fork(app, iterable, 1)

  for await (const value of iterator) {
    yield task(value) ?? value
  }
}

const revoke = app => {
  reject(app)
  apps.delete(app)
}

export * from './hooks.js'
export * from './options.js'

export {
  add,
  fork,
  init,
  io,
  listen,
  revoke,
  task
}
