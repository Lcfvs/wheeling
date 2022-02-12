/**
 * @module wheeling/internals/promise
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling/blob/master/src/internals/promise.js
 * @internal
 */

const memo = []

const resolvers = new WeakMap()

const pick = (resolve, reject) =>
  memo.unshift([resolve, reject])

const race = async (...promises) =>
  Promise.race(promises)

const resolvable = () => {
  const promise = new Promise(pick)

  resolvers.set(promise, memo.shift())

  return promise
}

const resolver = (promise, key) => {
  const value = resolvers.get(promise)?.[key]

  resolvers.delete(promise)

  return value
}

const resolve = (promise, value) =>
  resolver(promise, 0)?.(value)

const reject = (promise, error) =>
  resolver(promise, 1)?.(error)

const pending = async (...promises) => {
  const pending = {}

  return (await race(...promises, pending)) === pending
}

export {
  pending,
  race,
  reject,
  resolvable,
  resolve,
  resolver
}
