/**
 * @module wheeling/hooks/respondWith
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling/blob/master/src/hooks/respondWith.js
 */

/**
 * @type {hook}
 * @return {Promise}
 */
export default (event, promise) => {
  event.respondWith(promise)

  return promise
}
