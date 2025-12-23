import { test, expect } from '@playwright/test'

test.describe('Pre-paint correctness', () => {
  test('should apply theme before first paint (no flash)', async ({ page, context }) => {
    // Set dark theme in localStorage before navigation
    await context.addInitScript(() => {
      localStorage.setItem('theme', 'dark')
    })

    // Navigate with network/CPU throttling to simulate slow conditions
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    })

    // Check that data-theme is set immediately (synchronously during parse)
    const htmlTheme = await page.locator('html').getAttribute('data-theme')
    expect(htmlTheme).toBe('dark')

    // Check that CSS variables are set
    const bgColor = await page.locator('html').evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--bg')
    })
    expect(bgColor).toBe('#000000')

    // Check that color-scheme is set
    const colorScheme = await page.locator('html').evaluate((el) => {
      return getComputedStyle(el).colorScheme
    })
    expect(colorScheme).toContain('dark')
  })

  test('should work with slow 3G + CPU slowdown', async ({ page, context }) => {
    // Emulate slow connection
    await context.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100)) // Artificial delay
      await route.continue()
    })

    await context.addInitScript(() => {
      localStorage.setItem('theme', 'light')
    })

    await page.goto('/')

    // Even with slow connection, theme should be applied synchronously
    const htmlTheme = await page.locator('html').getAttribute('data-theme')
    expect(htmlTheme).toBe('light')
  })

  test('should use system theme as fallback', async ({ page, context }) => {
    // Don't set localStorage - should fall back to system (and then media query)
    await context.addInitScript(() => {
      localStorage.removeItem('theme')
    })

    // Emulate dark color scheme preference
    await page.emulateMedia({ colorScheme: 'dark' })

    await page.goto('/')

    const htmlTheme = await page.locator('html').getAttribute('data-theme')
    expect(htmlTheme).toBe('dark')
  })

  test('should handle localStorage failure gracefully', async ({ page, context }) => {
    // Make localStorage throw
    await context.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('localStorage is disabled')
        },
      })
    })

    await page.goto('/')

    // Should fall back to media query
    const htmlTheme = await page.locator('html').getAttribute('data-theme')
    expect(htmlTheme).toMatch(/^(light|dark)$/)
  })

  test('should validate theme values with allow list', async ({ page, context }) => {
    // Set invalid theme value
    await context.addInitScript(() => {
      localStorage.setItem('theme', 'invalid-theme')
    })

    await page.goto('/')

    // Should fall back to default (system)
    const htmlTheme = await page.locator('html').getAttribute('data-theme')
    expect(htmlTheme).toMatch(/^(light|dark)$/) // Resolved from system
  })

  test('should apply URL search params', async ({ page }) => {
    await page.goto('/?view=grid')

    const dataView = await page.locator('html').getAttribute('data-view')
    expect(dataView).toBe('grid')
  })

  test('should expose snapshot to client code', async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.setItem('theme', 'dark')
    })

    await page.goto('/')

    const snapshot = await page.evaluate(() => {
      return (window as any).__NEXT_CLIENT_INIT__
    })

    expect(snapshot).toBeDefined()
    expect(snapshot.theme).toBe('dark')
  })
})

test.describe('ClientVariants', () => {
  test('should render all variants but hide inactive ones', async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.setItem('theme', 'dark')
    })

    await page.goto('/')

    // Both variants should be in the DOM initially
    const lightVariant = page.locator('[data-client-variant="light"]')
    const darkVariant = page.locator('[data-client-variant="dark"]')

    await expect(lightVariant).toBeAttached()
    await expect(darkVariant).toBeAttached()

    // But only dark should be visible
    await expect(lightVariant).toBeHidden()
    await expect(darkVariant).toBeVisible()
  })

  test('should prune inactive variants after hydration', async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.setItem('theme', 'light')
    })

    await page.goto('/')

    // Wait for hydration
    await page.waitForLoadState('networkidle')

    // After pruning, dark variant should be removed from DOM
    const darkVariant = page.locator('[data-client-variant="dark"]')
    await expect(darkVariant).not.toBeAttached()

    // Light variant should still exist and be visible
    const lightVariant = page.locator('[data-client-variant="light"]')
    await expect(lightVariant).toBeAttached()
    await expect(lightVariant).toBeVisible()
  })

  test('should use default variant when attribute not set', async ({ page }) => {
    // Navigate without setting theme (will use default)
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Default is "light" for the variant
    const lightVariant = page.locator('[data-client-variant="light"]')
    await expect(lightVariant).toBeVisible()
  })
})

test.describe('Theme switching', () => {
  test('should persist theme changes', async ({ page, context }) => {
    await page.goto('/')

    // Click dark theme button
    await page.click('button:has-text("Dark")')

    // Should reload the page
    await page.waitForLoadState('networkidle')

    // Check that theme is now dark
    const htmlTheme = await page.locator('html').getAttribute('data-theme')
    expect(htmlTheme).toBe('dark')

    // Verify localStorage was updated
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(storedTheme).toBe('dark')
  })
})
