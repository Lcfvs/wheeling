/**
 * @module wheeling/hooks/awaitUntil
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling/blob/master/src/hooks/awaitUntil.js
 */

/**
 * @type {hook}
 * @return {Promise}
 */
export default (event, promise) => {
  event.waitUntil(promise)

  return promise
}
