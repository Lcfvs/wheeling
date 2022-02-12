import { terser } from 'rollup-plugin-terser'

const banner = `
/**
 * @preserve
 * @module wheeling/dist
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling/blob/master/dist/wheeling.min.js
 */
`

export default {
  input: `src/wheeling.js`,
  output: {
    banner,
    file: `dist/wheeling.min.js`,
    format: 'es',
    sourcemap: true
  },
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
