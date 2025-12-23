import { test } from '@playwright/test'

test('detailed debug', async ({ page, context }) => {
  // Set theme in localStorage
  await context.addInitScript(() => {
    localStorage.setItem('theme', 'dark')
  })

  // Listen for everything
  page.on('console', (msg) => {
    console.log(`BROWSER ${msg.type()}: ${msg.text()}`)
  })

  // Before navigation, let's see what happens
  await page.goto('/')

  // Wait a bit for everything to settle
  await page.waitForTimeout(2000)

  // Check everything
  const attrs = await page.evaluate(() => {
    const html = document.documentElement
    return {
      dataTheme: html.getAttribute('data-theme'),
      dataView: html.getAttribute('data-view'),
      style: html.getAttribute('style'),
      hasStyleProperty: !!html.style,
      computedBg: getComputedStyle(html).getPropertyValue('--bg'),
      snapshot: (window as any).__NEXT_CLIENT_INIT__,
      allAttrs: Array.from(html.attributes).map(a => ({ name: a.name, value: a.value }))
    }
  })

  console.log('=== After page load ===')
  console.log(JSON.stringify(attrs, null, 2))
})
