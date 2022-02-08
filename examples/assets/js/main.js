import { add, listen, preventDefault, task } from './wheeling.min.js'
import { app } from './app.js'

const { document } = globalThis

// logs every value
const basicLog = task(app, [1, 2, 3], console.log)

// listens the clicks on the document
const onClick = listen(app, document, {
  type: 'click',
  hooks: [
    preventDefault
  ]
})

// adds any number of iterators to the app, creating an infinite async loop for each of them
add(app, [
  basicLog,
  // logs on every { event: click }
  task(app, onClick, console.log)
])
