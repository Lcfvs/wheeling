/**
 * @module wheeling/hooks/stopImmediatePropagation
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling/blob/master/src/hooks/stopImmediatePropagation.js
 */

/**
 * @type {hook}
 * @return {void}
 */
export default event => {
  event.stopImmediatePropagation()
}
