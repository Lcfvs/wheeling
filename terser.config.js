import { minify } from 'terser'
import { readFile, writeFile } from 'fs/promises'

const config = {
  compress: {
    dead_code: true,
    keep_fnames: false
  },
  mangle: {
    keep_fnames: false,
    toplevel: false,
    safari10: true
  },
  module: true,
  sourceMap: {
    filename: '../src/wheeling.js',
    url: './wheeling.min.js.map'
  },
  output: {
    comments: 'some'
  }
}

const code = await readFile('src/wheeling.js', 'utf8')
const minified = await minify(code, config)

await writeFile('dist/wheeling.min.js', minified.code)
await writeFile('dist/wheeling.min.js.map', minified.map)
