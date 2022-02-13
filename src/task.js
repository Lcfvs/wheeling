/**
 * @module wheeling/task
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling/blob/master/src/task.js
 */

import fork from './fork.js'
import wrap from './internals/wrap.js'
import skip from './skip.js'

/**
 * @param {app} app
 * @param {AsyncIterable|Iterable} iterable
 * @param {function(*):*} task
 * @throws {ReferenceError}
 */
export default wrap(async function* (app, iterable, task) {
  const [iterator] = fork(app, iterable, 1)

  for await (const value of iterator) {
    try {
      yield task(value) ?? value
    } catch (error) {
      if (error !== skip) {
        throw error
      }
    }
  }
})
