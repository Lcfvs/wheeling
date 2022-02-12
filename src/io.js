/**
 * @module wheeling/io
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling/blob/master/src/io.js
 */

import { race, reject, resolvable, resolve } from './internals/promise.js'
import wrap from './internals/wrap.js'

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

/**
 * @param {app} app
 * @return {[AsyncIterableIterator,AsyncIterableIterator]}
 * @throws {ReferenceError}
 */
export default wrap(app => {
  const promises = [resolvable(), resolvable()]
  const input = writable(app, promises)
  const output = readable(app, promises)

  input.next()

  return [input, output]
})
