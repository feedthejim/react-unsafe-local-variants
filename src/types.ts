import type { ReactNode } from 'react'

/**
 * Defines where to read the variant value from
 */
export type ReadSource =
  | { type: 'localStorage'; key: string }
  | { type: 'cookie'; name: string }
  | { type: 'search'; name: string }
  | { type: 'media'; query: string; trueValue: string; falseValue: string }

/**
 * A variant definition created by the variant() function
 */
export type VariantDefinition<T extends readonly string[] = readonly string[]> = {
  key: string
  options: T
  default: T[number]
  read: ReadSource
}

/**
 * Props for the Variants component
 */
export type VariantsProps<T extends readonly string[]> = {
  use: VariantDefinition<T>
  children: { [K in T[number]]: ReactNode }
}
