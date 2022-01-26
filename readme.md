# wheeling

A tiny **flat** utility to turn any event listening to **infinite async iterator**

[Demo](https://codesandbox.io/embed/wheeling-demo-forked-95ccu?expanddevtools=1&hidenavigation=1&moduleview=1&theme=dark&view=preview)

```js
import { init, listener, preventDefault } from 'https://ga.jspm.io/npm:wheeling@1.0.6/src/wheeling.js'

const app = init()

const click = listener({
  type: 'click',
  hooks: [
    preventDefault
  ]
})

// logs every value
const basicLog = app.of([1, 2, 3], console.log)

// logs every { event: click }
const onClick = app.listen(document, click, console.log)

// adds any number of iterators to the app, creating an infinite async loop for each of them
app.add([
  basicLog,
  onClick
])
```

## <a name=#app>App</a>

### <a name=#app-add>`app = app.add([...iterators])`</a>

Runs any number of provided iterators


### <a name=#app-listen>`iterator = app.listen(target, listener, task = noop)`</a>

Returns an iterator listening an event type and apply a task, if provided, on the events

Yields an object like this: `{ event }`

Additionally, it can have `{ reject, resolve }` if any listener [hooks](#hooks) returns a **thenable** object, like a promise
(Mostly useful for the `ServiceWorker`)


### <a name=#app-listen>`iterator = app.of(iterable, task = noop)`</a>

Returns an iterator looping on the `ìterable` values and apply a task, if provided, on the values


### <a name=#app-listen>`app.revoke()`</a>

Stops all the added iterators and the app itself
(Mostly useful to launch a new version of the app)


## <a name=#exports>Exports</a>

### <a name=#constants>Constants</a>

* <a name=#constants-capture>`capture = true`</a>
* <a name=#constants-once>`once = true`</a>
* <a name=#constants-passive>`passive = true`</a>


### <a name=#functions>Functions</a>

### <a name=#functions-init>`app = ìnit()`</a>

Creates an instance of the `app`, see [app](#app)


### <a name=#functions-listener>`eventListener = listener({ hooks = [], type, ...constants })`</a>

Creates an event listener, based on
  * `hooks`: an array of functions executed **synchronously** when an event triggers
  * `type`: **MANDATORY*** the event type
  * `...constants`: see [constants](#constants)


### <a name=#hooks>Hooks</a>

* <a name=#hooks-awaitUntil>`awaitUntil`</a>
* <a name=#hooks-preventDefault>`preventDefault`</a>
* <a name=#hooks-respondWith>`respondWith`</a>
* <a name=#hooks-stopImmediatePropagation>`stopImmediatePropagation`</a>
* <a name=#hooks-stopPropagation>`stopPropagation`</a>


## <a name="license">License</a>

[MIT](https://github.com/Lcfvs/wheeling/blob/master/licence.md)
