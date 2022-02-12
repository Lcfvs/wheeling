import add from 'wheeling/add'
import listen from 'wheeling/listen'
import task from 'wheeling/task'
import preventDefault from 'wheeling/hooks/preventDefault'
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
await add(app, [
  basicLog,
  // logs on every { event: click }
  task(app, onClick, console.log)
])
