/**
 * @module wheeling/internals/promise
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling/blob/master/src/internals/wrap.js
 * @internal
 */

import { validate } from '../apps.js'

export default generator =>
  (app, ...params) => {
    validate(app)

    return generator(app, ...params)
  }
