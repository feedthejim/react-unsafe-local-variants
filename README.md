# react-unsafe-local-variants

**Zero-flash client-side variants for React SSR/SSG** - Read localStorage, cookies, URL params & media queries before first paint.

> **"Unsafe" Warning**: This package enables reading client-side values during SSR/SSG, which can cause hydration mismatches if misused. Use only for non-critical UI variants (themes, layout preferences) where the tradeoff is acceptable.

## Features

- **Zero Flash**: Inline script + CSS selectors show correct variant before first paint
- **SSG/ISR Compatible**: Works with statically generated pages
- **Framework Agnostic**: Works with Next.js, Remix, or any React SSR framework
- **Multiple Sources**: localStorage, cookies, URL search params, media queries
- **Type-Safe**: Full TypeScript support with inferred variant types
- **Auto-Pruning**: Hidden variants are removed from DOM after hydration

## Installation

```bash
npm install react-unsafe-local-variants
```

## Quick Start

```tsx
// 1. Define your variant (variants.ts)
import { variant, fromLocalStorage } from 'react-unsafe-local-variants'

export const theme = variant({
  key: 'theme',
  options: ['light', 'dark', 'system'] as const,
  default: 'system',
  read: fromLocalStorage('theme')
})

// 2. Use it anywhere (page.tsx)
import { Variants } from 'react-unsafe-local-variants'
import { theme } from './variants'

export default function Page() {
  return (
    <Variants use={theme}>
      {{
        light: <div className="light-theme">Light Mode</div>,
        dark: <div className="dark-theme">Dark Mode</div>,
        system: <div className="system-theme">Following OS</div>
      }}
    </Variants>
  )
}

// 3. Update value (client component)
'use client'
function ThemeSwitcher() {
  const setTheme = (value: string) => {
    localStorage.setItem('theme', value)
    location.reload()
  }
  return <button onClick={() => setTheme('dark')}>Dark Mode</button>
}
```

## API Reference

### `variant(config)`

Creates a variant definition.

```typescript
const theme = variant({
  key: 'theme',                    // Unique key (used as data-* attribute)
  options: ['light', 'dark'],      // Allowed values
  default: 'light',                // Default value
  read: fromLocalStorage('theme')  // How to read the value
})
```

### Read Helpers

#### `fromLocalStorage(key)`

Read from localStorage.

```typescript
read: fromLocalStorage('theme')
```

#### `fromCookie(name)`

Read from cookies.

```typescript
read: fromCookie('user_preference')
```

#### `fromSearchParam(name)`

Read from URL search parameters.

```typescript
read: fromSearchParam('feature')
// ?feature=beta → 'beta'
```

#### `fromMediaQuery(query, values)`

Read from CSS media query.

```typescript
read: fromMediaQuery('(prefers-color-scheme: dark)', {
  true: 'dark',
  false: 'light'
})
```

### `<Variants>`

Renders variant content based on the active value.

```tsx
<Variants use={theme}>
  {{
    light: <LightContent />,
    dark: <DarkContent />,
  }}
</Variants>
```

## How It Works

1. **Build**: All variants are rendered to HTML (SSG/ISR compatible)
2. **Parse**: Inline script reads value, sets `data-*` attribute on `<html>`
3. **Paint**: CSS shows correct variant instantly (no flash!)
4. **Hydrate**: React picks up, prunes hidden variants from DOM

```
Server HTML:
<html>
  <div data-variant="light">Light</div>  <!-- hidden by CSS -->
  <div data-variant="dark">Dark</div>    <!-- visible -->
</html>

After Hydrate:
<html data-theme="dark">
  <div data-variant="dark">Dark</div>    <!-- only active variant remains -->
</html>
```

## Examples

### Theme Switcher (localStorage)

```tsx
// variants.ts
export const theme = variant({
  key: 'theme-choice',
  options: ['light', 'dark', 'system'] as const,
  default: 'system',
  read: fromLocalStorage('theme')
})

// page.tsx
<Variants use={theme}>
  {{
    light: <LightTheme />,
    dark: <DarkTheme />,
    system: <SystemTheme />
  }}
</Variants>

// ThemeSwitcher.tsx (client component)
'use client'
export function ThemeSwitcher() {
  const setTheme = (value: string) => {
    localStorage.setItem('theme', value)
    location.reload()
  }
  return (
    <div>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}
```

### View Mode (Cookie)

```tsx
export const viewMode = variant({
  key: 'view-mode',
  options: ['grid', 'list', 'compact'] as const,
  default: 'list',
  read: fromCookie('view_mode')
})

// Update
document.cookie = 'view_mode=grid;path=/;max-age=31536000'
location.reload()
```

### Feature Flags (URL Param)

```tsx
export const featureFlag = variant({
  key: 'feature',
  options: ['stable', 'beta', 'experimental'] as const,
  default: 'stable',
  read: fromSearchParam('feature')
})

// Usage: ?feature=beta
```

### Motion Preference (Media Query)

```tsx
export const motionPref = variant({
  key: 'motion',
  options: ['full', 'reduced'] as const,
  default: 'full',
  read: fromMediaQuery('(prefers-reduced-motion: reduce)', {
    true: 'reduced',
    false: 'full'
  })
})
```

### System Color Scheme (Media Query)

```tsx
export const colorScheme = variant({
  key: 'color-scheme',
  options: ['light', 'dark'] as const,
  default: 'light',
  read: fromMediaQuery('(prefers-color-scheme: dark)', {
    true: 'dark',
    false: 'light'
  })
})
```

## TypeScript

Variant options are fully typed:

```tsx
const theme = variant({
  key: 'theme',
  options: ['light', 'dark'] as const,  // Note: as const
  default: 'light',
  read: fromLocalStorage('theme')
})

// TypeScript knows children must have 'light' and 'dark' keys
<Variants use={theme}>
  {{
    light: <div>Light</div>,
    dark: <div>Dark</div>,
    // @ts-error: 'blue' is not assignable
    blue: <div>Blue</div>
  }}
</Variants>
```

## Important Notes

### Hydration Safety

The `<Variants>` component is hydration-safe because:
- All variants are rendered on the server
- CSS hides non-matching variants (no content flash)
- React doesn't see a mismatch because all content exists in the DOM
- After hydration, hidden variants are pruned from the DOM

### CSP (Content Security Policy)

This package uses inline scripts. Ensure your CSP allows:
- `script-src 'unsafe-inline'`

### Multiple Variants

You can use multiple `<Variants>` components on the same page, even with the same variant definition. Each instance is independent.

## License

MIT
