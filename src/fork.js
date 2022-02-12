import { validate } from './apps.js'
import { pending, race } from './internals/promise.js'

const cast = async function* (iterable) {
  yield* iterable
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

/**
 * @module wheeling/fork
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling/blob/master/src/fork.js
 */

/**
 * @param {app} app
 * @param {AsyncIterable|Iterable} iterable
 * @param {?Number} length
 * @returns {AsyncIterableIterator[]}
 * @throws {ReferenceError}
 */
export default (app, iterable, length = 2) => {
  validate(app)

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
