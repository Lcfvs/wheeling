import { terser } from 'rollup-plugin-terser'

const banner = `
/**
 * @preserve
 * @module wheeling
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling
 */
`

const config = {
  input: `src/wheeling.js`,
  plugins: [
    terser({
      compress: {
        dead_code: true,
        keep_fnames: false
      },
      mangle: {
        keep_fnames: false,
        toplevel: true,
        safari10: true
      },
      module: true,
      output: {
        comments: /^\*\n \* @preserve/
      }
    })
  ],
  treeshake: false
}

const output = {
  banner,
  format: 'es',
  sourcemap: true
}

export default [
  {
    ...config,
    output: {
      ...output,
      file: `dist/wheeling.min.js`,
    }
  },
  {
    ...config,
    output: {
      ...output,
      file: `examples/assets/js/wheeling.min.js`,
    }
  }
]
