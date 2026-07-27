import { expect, test, type Page } from '@playwright/test'

const EMAIL = process.env.E2E_EMAIL
const PASSWORD = process.env.E2E_PASSWORD

async function signIn(page: Page) {
  test.skip(!EMAIL || !PASSWORD, 'Set E2E_EMAIL / E2E_PASSWORD to run authenticated tests')
  await page.goto('/login')
  await page.getByLabel('Email').fill(EMAIL!)
  await page.getByLabel('Password').fill(PASSWORD!)
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL('**/dashboard')
}

test('protected routes redirect to sign-in', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole('heading', { name: 'Incidents' })).toHaveCount(0)
})

test('the public status guide renders without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/status-guide')
  await expect(page.getByRole('heading', { name: 'Status guide' })).toBeVisible()
  await expect(page.getByText('Customer-facing outage or data risk', { exact: false })).toBeVisible()
  await context.close()
})

test('signing in and reading the dashboard works without JavaScript', async ({ browser }) => {
  test.skip(!EMAIL || !PASSWORD, 'Set E2E_EMAIL / E2E_PASSWORD to run authenticated tests')
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()

  await page.goto('/login')
  await page.getByLabel('Email').fill(EMAIL!)
  await page.getByLabel('Password').fill(PASSWORD!)
  await page.getByRole('button', { name: 'Sign in' }).click()

  await page.waitForURL('**/dashboard')
  await expect(page.getByRole('heading', { name: 'Incidents' })).toBeVisible()
  await expect(page.getByRole('link', { name: /incident:/ }).first()).toBeVisible()
  await context.close()
})

test('filters live in the URL and survive a reload', async ({ page }) => {
  await signIn(page)
  await page.getByRole('button', { name: /^Critical/ }).click()
  await expect(page).toHaveURL(/sev=critical/)

  const shown = page.getByText(/\d+ of \d+ shown/)
  const before = await shown.textContent()

  await page.reload()
  await expect(page).toHaveURL(/sev=critical/)
  await expect(shown).toHaveText(before!)
})

test('posting an update appears optimistically and then persists', async ({ page }) => {
  await signIn(page)
  await page.getByRole('link', { name: /incident:/ }).first().click()
  await page.waitForURL('**/incidents/**')

  const message = `Playwright check ${Date.now()}`
  await page.getByLabel('Post an update').fill(message)
  await page.getByRole('button', { name: 'Publish' }).click()

  await expect(page.getByText(message)).toBeVisible({ timeout: 1000 })
  await expect(page.getByRole('status').filter({ hasText: 'Update posted' })).toBeVisible()

  await page.reload()
  await expect(page.getByText(message)).toBeVisible()
})
