/**
 * @module wheeling
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling
 * @preserve
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

const pending = async promise => {
  const pending = {}

  return (await race(promise, pending)) === pending
}

export {
  pending,
  race,
  reject,
  resolvable,
  resolve,
  resolver
}
