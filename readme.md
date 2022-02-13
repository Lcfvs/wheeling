# wheeling

A **flat** utility to easily chain any number of tasks & turn any event listening to **infinite async iterables**

[Demo](https://wheeling.glitch.me/)

[Demo sources](https://glitch.com/edit/#!/wheeling?path=assets/js/main.js)


## <a name="install">Install</a>

## <a name="install-using-npm">Using NPM</a>

`npm i wheeling`

## <a name="install-using-jspmi">Using JSPMI</a>

`jspmi i wheeling`


## <a name="examples">Examples</a>

### <a name="examples--app-initilization">App initialization</a>

```js
// apps.js
import init from 'wheeling/init'

export const app = init()
```


### <a name="examples--create-a-task-on-an-iterable">Create a task on an iterable</a>

```js
import task from 'wheeling/task'
import { app } from './apps.js'

// logs every value
export const logger = task(app, [1, 2, 3], console.log)
```


### <a name="examples--create-a-skippable-task">Create a skippable task</a>

```js
import skip from 'wheeling/skip'
import task from 'wheeling/task'
import { app } from './apps.js'

// logs every value, except the 2
export const logger = task(app, [1, 2, 3], value => {
  if (value === 2) {
    throw skip
  }
  
  console.log(value)
})
```


### <a name="examples--create-any-forks-of-an-iterable">Create any forks of an iterable</a>

```js
import fork from 'wheeling/fork'
import task from 'wheeling/task'
import { app } from './apps.js'

const logger = task(app, [4, 5, 6], console.log)

// logs every value... twice!
export const forks = fork(app, logger, 2)
```


### <a name="examples--create-an-input-output">Create an input/output</a>

```js
import io from 'wheeling/io'
import task from 'wheeling/task'
import { app } from './apps.js'

const [input, output] = io(app)

// logs every value
export const reader = task(app, output, console.log)

queueMicrotask(async () => {
  await input.next(7)
  await input.next(8)
  await input.next(9)
  await input.return()
})
```


### <a name="examples--create-an-iterable-listener">Create an iterable listener</a>

```js
import listen from 'wheeling/listen'
import preventDefault from 'wheeling/hooks/preventDefault'
import task from 'wheeling/task'
import { app } from './apps.js'

const onClick = listen(app, document.body, {
  type: 'click',
  hooks: [
    preventDefault
  ]
})

// logs every { event: click }
export const logOnClick = task(app, onClick, console.log)
```


### <a name="examples--autorun-the-iterables">Autorun the iterables</a>

```js
import add from 'wheeling/add'
import { app } from './apps.js'
import { logger } from './logger.js'
import { forks } from './forks.js'
import { reader } from './reader.js'
import { logOnClick } from './logOnClick.js'

await add(app, [
  logger,
  ...forks,
  reader,
  logOnClick
])
```


### <a name="examples--revoke-an-app">Revoke an app</a>

```js
import revoke from 'wheeling/revoke'
import { app } from './apps.js'

// stops all the iterators registered for that app
revoke(app)
```


## <a name="api">API</a>

### <a name="wheeling">`wheeling` / `wheeling/dist`</a>

#### <a name="api-init">`wheeling/init`</a>

`app = init()`

Initialises an app, returning its promise used for every library functions 


#### <a name="api-add">`wheeling/add`</a>

`async add(app, [...iterables])`

Runs any number of provided iterables


#### <a name="api-fork">`wheeling/fork`</a>

`iterables = fork(app, iterable, length = 2)`

Returns an array of iterables reading the provided one


#### <a name="api-io">`wheeling/io`</a>

`[input, output] = io(app)`

Returns an array containing
  * `input`: an iterable used to write to the output one
  * `output`: an iterable used to read the input one


#### <a name="api-listen">`wheeling/listen`</a>

`iterable = listen(app, target, listener)`

Returns an iterable listening an event type

The target must be an `EventTarget`

The listener must be an object containing
  * `hooks`: an array of functions executed **synchronously** when an event triggers
  * `type`: **MANDATORY*** the event type
  * `...options`: see [options](#options)

Yields an object like this: `{ event, target }`, where the `target` is `event.currentTarget ?? event.target`

Additionally, it can have `{ reject, resolve }` if any listener [hooks](#hooks) returns a **thenable** object, like a promise
(Mostly useful for the `ServiceWorker`)


#### <a name="api-revoke">`revoke(app)`</a>

Stops all the added iterables and the app itself
(Mostly useful to launch a new version of the app)


### <a name="hooks">`wheeling/hooks`</a>

* <a name=#hooks-awaitUntil>`wheeling/hooks/awaitUntil`</a>
* <a name=#hooks-preventDefault>`wheeling/hooks/preventDefault`</a>
* <a name=#hooks-respondWith>`wheeling/hooks/respondWith`</a>
* <a name=#hooks-stopImmediatePropagation>`wheeling/hooks/stopImmediatePropagation`</a>
* <a name=#hooks-stopPropagation>`wheeling/hooks/stopPropagation`</a>


### <a name="options">`wheeling/options`</a>

* <a name=#options-capture>`wheeling/options/capture`</a>
* <a name=#options-once>`wheeling/options/once`</a>
* <a name=#options-passive>`wheeling/options/passive`</a>


### <a name="skip">`wheeling/skip`</a>

An error to `throw` into a task, to skip an iteration


## <a name="license">License</a>

[MIT](https://github.com/Lcfvs/wheeling/blob/master/license.md)
