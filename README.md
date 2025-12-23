# next-unsafe-client-variants

**Pre-paint client-side rendering for Next.js App Router** - Synchronously read browser-only params (search params, cookies, localStorage, media queries) during HTML parsing and apply DOM changes before first paint.

> ⚠️ **"Unsafe" Warning**: This package is marked "unsafe" because it enables reading client-side values during SSG/ISR, which can lead to hydration mismatches if not used carefully. Use only for non-critical UI variants (themes, layout preferences) where the tradeoff is acceptable.

## Features

- **Zero Flash**: Apply DOM attributes, classes, and CSS variables before first paint
- **SSG/ISR Compatible**: Works with statically generated Next.js pages
- **Multiple Variants**: Render multiple HTML variants and select one with CSS (no hydration mismatch)
- **Tiny**: Inline script is <2KB gzipped
- **Type-Safe**: Full TypeScript support
- **App Router Only**: Built specifically for Next.js 13+ App Router

## Installation

```bash
npm install next-unsafe-client-variants
```

## Quick Start

### Basic Theme Example

```tsx
// app/layout.tsx
import { ClientInit } from 'next-unsafe-client-variants'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <ClientInit
          reads={{
            theme: {
              from: 'localStorage',
              key: 'theme',
              allow: ['light', 'dark', 'system'],
              default: 'system',
            },
          }}
          apply={[
            {
              type: 'html-attr',
              name: 'data-theme',
              valueFrom: 'theme',
              resolveSystemTheme: true // 'system' → 'dark' or 'light'
            },
            {
              type: 'color-scheme',
              valueFrom: 'theme',
              resolveSystemTheme: true
            },
          ]}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

Your CSS can now use `html[data-theme="dark"]` selectors without flash!

## API Reference

### ClientInit (Server Component)

Emits an inline script that runs during HTML parsing to read browser values and apply DOM changes.

#### Props

```typescript
type ClientInitProps = {
  reads: Record<string, ReadSpec>  // Values to read
  apply?: ApplySpec[]              // DOM changes to apply
  expose?: false | {               // Expose snapshot to client
    global?: string                // Default: "__NEXT_CLIENT_INIT__"
    once?: boolean                 // Default: true (delete after first read)
  }
  id?: string                      // Optional ID for deduplication
}
```

#### ReadSpec

```typescript
type ReadSpec = ReadSource & {
  allow?: readonly string[]  // Whitelist of valid values
  default: string            // Fallback value (required)
  maxLen?: number            // Max length (default: 64)
  pattern?: string           // Regex pattern for validation
  fallback?: ReadSource      // Fallback source if primary fails
}

type ReadSource =
  | { from: 'search'; name: string }                          // URL search param
  | { from: 'cookie'; name: string }                          // Cookie value
  | { from: 'localStorage'; key: string }                     // localStorage item
  | { from: 'media'; query: string; trueValue: string; falseValue: string }  // Media query
```

#### ApplySpec

```typescript
type ApplySpec =
  | { type: 'html-attr'; name: string; valueFrom: string; map?: Record<string,string>; resolveSystemTheme?: boolean }
  | { type: 'html-class'; name: string; valueFrom: string; map?: Record<string,string>; resolveSystemTheme?: boolean }
  | { type: 'css-var'; name: string; valueFrom: string; map: Record<string,string>; resolveSystemTheme?: boolean }
  | { type: 'css-vars'; valueFrom: string; sets: Record<string, Record<string,string>>; resolveSystemTheme?: boolean }
  | { type: 'color-scheme'; valueFrom: string; resolveSystemTheme?: boolean }
```

### ClientVariants (Server Component)

Renders multiple HTML variants and selects one pre-paint using CSS selectors.

```tsx
import { ClientVariants } from 'next-unsafe-client-variants'

<ClientVariants
  select={{ attr: 'data-theme', default: 'light' }}
  variants={{
    light: <LightThemeContent />,
    dark: <DarkThemeContent />,
  }}
  prune="after-hydration"  // Optional: remove inactive variants after hydration
/>
```

### Client Functions

```tsx
'use client'
import { readClientInitOnce, useClientInitValue } from 'next-unsafe-client-variants/client'

// One-time read (consuming)
const snapshot = readClientInitOnce()
console.log(snapshot.theme) // 'dark'

// Hook (non-consuming)
function ThemeDisplay() {
  const theme = useClientInitValue('theme')
  return <div>Current theme: {theme}</div>
}
```

## Examples

### Complete Theme System with CSS Variables

```tsx
// app/layout.tsx
<ClientInit
  reads={{
    theme: {
      from: 'localStorage',
      key: 'theme',
      allow: ['light', 'dark', 'system'],
      default: 'system',
    },
  }}
  apply={[
    { type: 'html-attr', name: 'data-theme', valueFrom: 'theme', resolveSystemTheme: true },
    { type: 'color-scheme', valueFrom: 'theme', resolveSystemTheme: true },
    {
      type: 'css-vars',
      valueFrom: 'theme',
      resolveSystemTheme: true,
      sets: {
        light: {
          '--bg': '#ffffff',
          '--fg': '#000000',
          '--primary': '#0070f3',
        },
        dark: {
          '--bg': '#000000',
          '--fg': '#ffffff',
          '--primary': '#0070f3',
        },
      },
    },
  ]}
/>
```

### Responsive Variants (Mobile/Desktop)

```tsx
<ClientInit
  reads={{
    viewport: {
      from: 'media',
      query: '(min-width: 768px)',
      trueValue: 'desktop',
      falseValue: 'mobile',
      default: 'mobile',
    },
  }}
  apply={[
    { type: 'html-attr', name: 'data-viewport', valueFrom: 'viewport' },
  ]}
/>

<ClientVariants
  select={{ attr: 'data-viewport', default: 'mobile' }}
  variants={{
    mobile: <MobileNav />,
    desktop: <DesktopNav />,
  }}
  prune="after-hydration"
/>
```

### Search Param-Based View

```tsx
<ClientInit
  reads={{
    view: {
      from: 'search',
      name: 'view',
      allow: ['grid', 'list'],
      default: 'grid',
    },
  }}
  apply={[
    { type: 'html-attr', name: 'data-view', valueFrom: 'view' },
  ]}
/>
```

### Cookie-Based Language

```tsx
<ClientInit
  reads={{
    lang: {
      from: 'cookie',
      name: 'NEXT_LOCALE',
      allow: ['en', 'fr', 'es', 'de'],
      default: 'en',
      pattern: '^[a-z]{2}$',
    },
  }}
  apply={[
    { type: 'html-attr', name: 'lang', valueFrom: 'lang' },
  ]}
/>
```

## Important Notes

### Hydration Mismatches

- **ClientInit**: Safe - only modifies DOM, doesn't affect React tree
- **ClientVariants**: Safe - renders ALL variants, CSS hides inactive ones
- **Client Code**: Be careful! If you use the snapshot in rendering, ensure SSR returns the default

### resolveSystemTheme

When `resolveSystemTheme: true`, the value "system" is resolved to "dark" or "light" using `matchMedia('(prefers-color-scheme: dark)')`. The resolved value is both:
- Applied to the DOM
- Stored in the snapshot (if `resolveSystemTheme` is true)

### Security Constraints

- Max 8 keys in `reads`
- Max value length: 128 chars (configurable via `maxLen`)
- Inline script: ≤2KB gzipped
- No arbitrary JS execution

### Deduplication

**Only one ClientInit per page.** Multiple instances will throw an error.

### CSP (Content Security Policy)

This package uses inline scripts. Ensure your CSP allows:
- `script-src 'unsafe-inline'` OR
- Use a nonce-based CSP (not yet supported in v0)

## Build & Development

```bash
npm install
npm run typecheck   # Type checking
npm run check-size  # Validate script size
npm run build       # Build package
```

## License

MIT

## Contributing

Issues and PRs welcome!
