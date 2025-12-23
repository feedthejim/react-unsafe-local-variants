import type { ReadSource } from './types'

/**
 * Read variant value from localStorage
 *
 * @example
 * ```ts
 * const theme = variant({
 *   key: 'theme',
 *   options: ['light', 'dark', 'system'],
 *   default: 'system',
 *   read: fromLocalStorage('theme')
 * })
 * ```
 */
export function fromLocalStorage(key: string): ReadSource {
  return { type: 'localStorage', key }
}

/**
 * Read variant value from a cookie
 *
 * @example
 * ```ts
 * const density = variant({
 *   key: 'density',
 *   options: ['compact', 'comfortable', 'spacious'],
 *   default: 'comfortable',
 *   read: fromCookie('user_density')
 * })
 * ```
 */
export function fromCookie(name: string): ReadSource {
  return { type: 'cookie', name }
}

/**
 * Read variant value from URL search parameters
 *
 * @example
 * ```ts
 * const view = variant({
 *   key: 'view',
 *   options: ['grid', 'list'],
 *   default: 'grid',
 *   read: fromSearchParam('view')
 * })
 * ```
 */
export function fromSearchParam(name: string): ReadSource {
  return { type: 'search', name }
}

/**
 * Read variant value from a CSS media query
 *
 * @example
 * ```ts
 * const motion = variant({
 *   key: 'motion',
 *   options: ['reduced', 'full'],
 *   default: 'full',
 *   read: fromMediaQuery('(prefers-reduced-motion: reduce)', {
 *     true: 'reduced',
 *     false: 'full'
 *   })
 * })
 * ```
 */
export function fromMediaQuery(
  query: string,
  values: { true: string; false: string }
): ReadSource {
  return {
    type: 'media',
    query,
    trueValue: values.true,
    falseValue: values.false,
  }
}
