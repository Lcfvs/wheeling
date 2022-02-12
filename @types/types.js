/**
 * @module wheeling/@types
 * @copyright Lcf.vs 2022
 * @licence MIT
 * @link https://github.com/Lcfvs/wheeling/blob/master/@types/types.js
 */

/**
 * @typedef {
 *   Promise<void>
 * } app
 */

/**
 * @typedef {
 *   function(Event, Promise): ?Promise
 * } hook
 */

/**
 * @typedef {
 *   {
 *     hooks: ?hook[],
 *     type: string
 *   }
 *   & options
 * } listener
 */

/**
 * @typedef {
 *   {
 *     capture: ?boolean,
 *     once: ?boolean,
 *     passive: ?boolean
 *   }
 * } options
 */
