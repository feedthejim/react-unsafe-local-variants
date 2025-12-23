import { test } from '@playwright/test'

test('debug script execution', async ({ page }) => {
  // Listen for console messages
  page.on('console', (msg) => {
    console.log(`BROWSER ${msg.type()}: ${msg.text()}`)
  })

  // Listen for page errors
  page.on('pageerror', (error) => {
    console.log(`PAGE ERROR: ${error.message}`)
    console.log(error.stack)
  })

  await page.goto('/')

  // Check if script ran
  const dataTheme = await page.locator('html').getAttribute('data-theme')
  console.log('data-theme attribute:', dataTheme)

  // Check if window object was set
  const snapshot = await page.evaluate(() => {
    return (window as any).__NEXT_CLIENT_INIT__
  })
  console.log('Snapshot:', snapshot)

  // Get all attributes on html
  const allAttrs = await page.locator('html').evaluate((el) => {
    const attrs: Record<string, string | null> = {}
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i]
      attrs[attr.name] = attr.value
    }
    return attrs
  })
  console.log('All HTML attributes:', allAttrs)

  // Check inline scripts
  const scripts = await page.locator('script[data-client-init-id]').count()
  console.log('ClientInit scripts found:', scripts)

  if (scripts > 0) {
    const scriptContent = await page.locator('script[data-client-init-id]').first().innerHTML()
    console.log('Script content (first 200 chars):', scriptContent.substring(0, 200))
  }
})
