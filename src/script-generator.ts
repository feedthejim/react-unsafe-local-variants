import type { VariantDefinition } from './types'

/**
 * Escapes a string for use in CSS selectors
 */
function escapeCSS(str: string): string {
  return str.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&')
}

/**
 * Generates a unique ID for a variant instance
 */
export function generateVariantId(key: string, options: readonly string[]): string {
  const hash = options.join(',').split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  return `${key}-${Math.abs(hash).toString(36).slice(0, 6)}`
}

/**
 * Generates the inline script that reads the variant value and sets the HTML attribute
 */
export function generateReadScript<T extends readonly string[]>(
  definition: VariantDefinition<T>
): string {
  const { key, options, default: defaultValue, read } = definition
  const attrName = `data-${key}`
  const optionsArray = JSON.stringify([...options])

  let readCode: string

  switch (read.type) {
    case 'localStorage':
      readCode = `try{v=localStorage.getItem(${JSON.stringify(read.key)})}catch(e){}`
      break
    case 'cookie':
      readCode = `var m=document.cookie.match(new RegExp('(?:^|; )'+${JSON.stringify(read.name)}+'=([^;]*)'));if(m)v=decodeURIComponent(m[1])`
      break
    case 'search':
      readCode = `v=new URLSearchParams(location.search).get(${JSON.stringify(read.name)})`
      break
    case 'media':
      readCode = `v=window.matchMedia(${JSON.stringify(read.query)}).matches?${JSON.stringify(read.trueValue)}:${JSON.stringify(read.falseValue)}`
      break
  }

  return `(function(){var v;${readCode};if(!v||${optionsArray}.indexOf(v)===-1)v=${JSON.stringify(defaultValue)};document.documentElement.setAttribute(${JSON.stringify(attrName)},v)})()`
}

/**
 * Generates CSS to show/hide variants based on the HTML attribute
 */
export function generateVariantCSS<T extends readonly string[]>(
  definition: VariantDefinition<T>,
  variantId: string
): string {
  const { key, options, default: defaultValue } = definition
  const attrName = `data-${key}`

  let css = ''

  // Hide all variants by default
  css += `[data-variant][data-variant-key="${variantId}"]{display:none;}`

  // Show variant matching html attribute
  for (const option of options) {
    const escapedOption = escapeCSS(option)
    css += `html[${attrName}="${escapedOption}"] [data-variant="${escapedOption}"][data-variant-key="${variantId}"]{display:block;}`
  }

  // Fallback when no attribute is set (show default)
  const escapedDefault = escapeCSS(defaultValue)
  css += `html:not([${attrName}]) [data-variant="${escapedDefault}"][data-variant-key="${variantId}"]{display:block;}`

  return css
}

