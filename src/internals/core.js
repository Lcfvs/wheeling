/**
 * @module wheeling
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling
 * @preserve
 */

import { pending, race, reject, resolvable, resolve, resolver } from './promise.js'

const cast = async function* (iterable) {
  yield* iterable
}

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

const iterate = async function* (app, promises, keys, key, reader) {
  const entries = promises.get(key)

  try {
    while (await pending(app)) {
      if (!entries.length) {
        const promise = race(app, reader.next())

        for (const key of keys) {
          promises.get(key).push(promise)
        }
      }

      const { done, value } = await race(app, entries.shift())

      if (done) {
        break
      }

      yield value
    }
  } catch {} finally {
    keys.delete(key)
    promises.delete(key)
  }
}

const readable = async function* (app, promises) {
  try {
    while (promises.length) {
      const [input, next] = promises

      resolve(next)
      yield race(app, input)
    }
  } catch {} finally {
    if (promises.length) {
      reject(promises.at(-1))
    }
  }
}

const writable = async function* (app, promises) {
  try {
    while (promises.length) {
      const [input, current] = promises

      await race(app, current)
      promises.splice(0, 2, resolvable(), resolvable())
      resolve(input, yield)
    }
  } catch {}
}

export {
  cast,
  handleEvent,
  iterate,
  readable,
  writable
}
