/**
 * @module wheeling
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @see {@link https://github.com/Lcfvs/wheeling}
 * @preserve
 */

let resolver

const { assign, create, freeze } = Object

const instances = new WeakMap()

const end = create(null)

const frozen = (prototype = null, ...extensions) =>
  freeze(merge(prototype, ...extensions))

const merge = (prototype = null, ...extensions) =>
  assign(create(prototype), ...extensions)

const noop = value => value

const pick = (resolve, reject) =>
  resolver = { reject, resolve }

const resolvable = () =>
  [new Promise(pick), resolver]

const handleEvent = function (event) {
  const { hooks: [...hooks] = [], resolvers } = this
  const [, { resolve }] = resolvers.at(-1)
  const [promise, resolver] = resolvable()
  let returned

  for (const hook of hooks) {
    returned = hook(event, promise) ?? returned
  }

  resolve(merge(null, { event }, returned && resolver))
  resolvers.push(resolvable())
}

const loop = function* () {
  const iterators = []

  try {
    while (iterators.push(run(yield))) {}
  } finally {
    for (const iterator of iterators) {
      iterator.return(end)
    }
  }
}

const prototype = frozen(null, {
  async* listen (target, listener, task = noop) {
    const { capture, once, passive, type } = listener
    const options = { capture, once, passive }
    const resolvers = [resolvable()]
    const clone = frozen(listener, { handleEvent, resolvers })
    const instance = instances.get(this)
    const { listeners } = instance

    if (!listeners.has(listener)) {
      listeners.set(listener, new WeakSet())
    }

    const targets = listeners.get(listener)

    if (targets.has(target)) {
      throw new Error('Duplicate event listening')
    }

    targets.add(target)
    target.addEventListener(type, clone, options)

    try {
      while (true) {
        const [[promise]] = resolvers
        const context = await Promise.race([promise, instance.promise])

        if (context === end) {
          break
        }

        yield (await task(context)) ?? context
        resolvers.shift()

        if (!resolvers.length) {
          resolvers.push(resolvable())
        }

        if (once) {
          break
        }
      }
    } finally {
      target.removeEventListener(type, clone, options)
      targets.delete(target)
    }
  },
  add ([...iterators]) {
    const { iterator } = instances.get(this)

    for (const current of iterators) {
      iterator.next(current)
    }

    return this
  },
  async* of (iterable, task = noop) {
    try {
      for await (const value of iterable) {
        yield task(value) ?? value
      }
    } finally {
      iterable.return?.(end)
    }
  },
  revoke () {
    const store = instances.get(this)

    if (store) {
      const { iterator, resolve } = store

      resolve(end)
      iterator.return(end)
      instances.delete(this)
    }
  }
})

const run = iterator => {
  queueMicrotask(async () => {
    for await (const context of iterator) {
      if (context === end) {
        break
      }
    }
  })

  return iterator
}

const listener = ({ hooks: [...hooks] = [], ...properties }) =>
  frozen(null, {
    hooks: freeze(hooks),
    ...properties
  })

const init = () => {
  const iterator = loop()
  const instance = frozen(prototype)
  const listeners = new WeakMap()
  const [promise, { resolve }] = resolvable()

  instances.set(instance, { iterator, listeners, promise, resolve })
  iterator.next()

  return instance
}

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

const capture = true

const once = true

const passive = true

export {
  listener,
  init,
  awaitUntil,
  preventDefault,
  respondWith,
  stopImmediatePropagation,
  stopPropagation,
  capture,
  once,
  passive
}
