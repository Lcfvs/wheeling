/**
 * @module wheeling/hooks.js
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling
 */

const awaitUntil = (event, promise) => {
  event.waitUntil(promise)

  return promise
}

const preventDefault = event =>
  event.preventDefault()

const respondWith = (event, promise) => {
  event.respondWith(promise)

  return promise
}

const stopImmediatePropagation = event =>
  event.stopImmediatePropagation()

const stopPropagation = event =>
  event.stopPropagation()

export {
  awaitUntil,
  preventDefault,
  respondWith,
  stopImmediatePropagation,
  stopPropagation
}
