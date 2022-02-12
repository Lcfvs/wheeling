/**
 * @module wheeling/apps
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling/blob/master/src/apps.js
 */

import { reject, resolvable, resolve } from './internals/promise.js'

const apps = new WeakMap()

/**
 * @async
 * @param {app} app
 * @param {(AsyncIterableIterator|IterableIterator)[]} iterables
 */
export const add = async (app, iterables) => {
  validate(app)

  const promises = []

  for (const iterable of iterables) {
    const promise = resolvable()

    promises.push(promise)

    queueMicrotask(async () => {
      while (true) {
        const current = iterable.next()

        resolve(promise)

        if ((await current).done) {
          break
        }
      }
    })
  }

  await Promise.all(promises)
}

/**
 * @returns {app}
 */
export const init = () => {
  const app = resolvable()

  apps.set(app, 1)

  return app
}

/**
 * @param {app} app
 */
export const revoke = app => {
  reject(app)
  apps.delete(app)
}

/**
 * @param {app} app
 * @throws {ReferenceError}
 */
export const validate = app => {
  if (!apps.has(app)) {
    throw new ReferenceError('Unknown app')
  }
}
