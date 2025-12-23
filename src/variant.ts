import type { ReadSource, VariantDefinition } from './types'

/**
 * Creates a variant definition
 *
 * @example
 * ```tsx
 * const theme = variant({
 *   key: 'theme',
 *   options: ['light', 'dark', 'system'],
 *   default: 'system',
 *   read: fromLocalStorage('theme')
 * })
 * ```
 */
export function variant<const T extends readonly string[]>(config: {
  key: string
  options: T
  default: T[number]
  read: ReadSource
}): VariantDefinition<T> {
  return config
}
