# wheeling

A **flat** utility to easily chain any number of tasks & turn any event listening to **infinite async iterables**

[Demo](https://codesandbox.io/embed/wheeling-demo-bysvo?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fassets%2Fjs%2Fmain.js&moduleview=1&theme=dark)


## <a name="install">Install</a>

## <a name="install-using-npm">Using NPM</a>

`npm i wheeling`

## <a name="install-using-jspmi">Using JSPMI</a>

`jspmi i wheeling`


## <a name="examples">Examples</a>

### <a name="examples--app-initilization">App initialization</a>

```js
// app.js
import { init } from 'wheeling'

export default init()
```


### <a name="examples--create-a-task-on-an-iterable">Create a task on an iterable</a>

```js
import { task } from 'wheeling'
import app from './app.js'

// logs every value
export default task(app, [1, 2, 3], console.log)
```


### <a name="examples--create-any-forks-of-an-iterable">Create any forks of an iterable</a>

```js
import { fork, task } from 'wheeling'
import app from './app.js'

const logger = task(app, [4, 5, 6], console.log)

// logs every value... twice!
export default fork(app, logger, 2)
```


### <a name="examples--create-an-input-output">Create an input/output</a>

```js
import { io, task } from 'wheeling'
import app from './app.js'

const [input, output] = io(app)

// logs every value
export default task(app, output, console.log)

queueMicrotask(async () => {
  await input.next(7)
  await input.next(8)
  await input.next(9)
  await input.return()
})
```


### <a name="examples--create-an-iterable-listener">Create an iterable listener</a>

```js
import { listen, preventDefault, task } from 'wheeling'
import app from './app.js'

const onClick = listen(app, document.body, {
  type: 'click',
  hooks: [
    preventDefault
  ]
})

add(app, [
  // logs every { event: click }
  task(app, onClick, console.log)
])
```


### <a name="examples--autorun-the-iterables">Autorun the iterables</a>

```js
import { add } from 'wheeling'
import app from './app.js'
import task from './task.js'
import forks from './forks.js'
import output from './output.js'
import listener from './listener.js'

add(app, [
  task,
  ...forks,
  output,
  listener
])
```


### <a name="examples--revoke-an-app">Revoke an app</a>

```js
import { revoke } from 'wheeling'
import app from './app.js'

// stops all the iterators registered for that app
revoke(app)
```


## <a name="api">API</a>

### <a name="api-init">`app = init()`</a>

Initialises an app, returning its promise used for every library functions 


### <a name="api-add">`add(app, [...iterables])`</a>

Runs any number of provided iterables


### <a name="api-fork">`iterables = fork(app, iterable, length = 2)`</a>

Returns an array of iterables reading the provided one


### <a name="api-io">`[input, output] = io(app)`</a>

Returns an array containing
  * `input`: an iterable used to write to the output one
  * `output`: an iterable used to read the input one


### <a name="api-listen">`iterable = listen(app, target, listener)`</a>

Returns an iterable listening an event type

The target must be an `EventTarget`

The listener must be an object containing
  * `hooks`: an array of functions executed **synchronously** when an event triggers
  * `type`: **MANDATORY*** the event type
  * `...options`: see [options](#options)

Yields an object like this: `{ event }`

Additionally, it can have `{ reject, resolve }` if any listener [hooks](#hooks) returns a **thenable** object, like a promise
(Mostly useful for the `ServiceWorker`)


### <a name="api-revoke">`revoke(app)`</a>

Stops all the added iterables and the app itself
(Mostly useful to launch a new version of the app)


## <a name="hooks">Hooks</a>

* <a name=#hooks-awaitUntil>`awaitUntil`</a>
* <a name=#hooks-preventDefault>`preventDefault`</a>
* <a name=#hooks-respondWith>`respondWith`</a>
* <a name=#hooks-stopImmediatePropagation>`stopImmediatePropagation`</a>
* <a name=#hooks-stopPropagation>`stopPropagation`</a>

## <a name="options">Options</a>

* <a name=#options-capture>`capture = true`</a>
* <a name=#options-once>`once = true`</a>
* <a name=#options-passive>`passive = true`</a>


## <a name="license">License</a>

[MIT](https://github.com/Lcfvs/wheeling/blob/master/license.md)
