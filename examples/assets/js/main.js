import app from './app.js'
import click from './listeners/click.js'

// logs every value
const basicLog = app.of([1, 2, 3], console.log)

// logs every { event: click }
const onClick = app.listen(document, click, console.log)

// adds any number of iterators to the app, creating an infinite async loop for each of them
app.add([
  basicLog,
  onClick
])
