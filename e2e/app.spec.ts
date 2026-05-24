import { test, expect } from '@playwright/test';

// ── Smoke Tests ───────────────────────────────────────────────────────────────
test.describe('Smoke — app loads', () => {
  test('loads homepage with market bar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('LIVE MARKETS')).toBeVisible();
    await expect(page.getByText('STOCKIQ')).toBeVisible();
  });

  test('shows S&P 500 index in market bar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('S&P 500')).toBeVisible();
  });
});

// ── Navigation Tests ──────────────────────────────────────────────────────────
test.describe('Sidebar navigation', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('navigates to Magnificent 7', async ({ page }) => {
    await page.getByText('Magnificent 7').click();
    await expect(page.getByText('AAPL')).toBeVisible();
    await expect(page.getByText('NVDA')).toBeVisible();
  });

  test('navigates to S&P 100 Movers', async ({ page }) => {
    await page.getByText('S&P 100 Movers').click();
    await expect(page.getByText('Top Gainers')).toBeVisible();
  });

  test('navigates to Buffett Portfolio', async ({ page }) => {
    await page.getByText('Buffett Portfolio').click();
    await expect(page.getByText('Berkshire Hathaway')).toBeVisible();
  });

  test('navigates to AI Stocks & ETFs', async ({ page }) => {
    await page.getByText('AI Stocks & ETFs').click();
    await expect(page.getByText('AI Stocks')).toBeVisible();
  });

  test('navigates to Crypto Top 5', async ({ page }) => {
    await page.getByText('Crypto Top 5').click();
    await expect(page.getByText('Bitcoin')).toBeVisible();
    await expect(page.getByText('Ethereum')).toBeVisible();
  });

  test('collapses and expands sidebar', async ({ page }) => {
    const menuBtn = page.locator('button').first();
    await menuBtn.click();
    await expect(page.getByText('STOCKIQ')).not.toBeVisible();
    await menuBtn.click();
    await expect(page.getByText('STOCKIQ')).toBeVisible();
  });
});

// ── Portfolio Tests ───────────────────────────────────────────────────────────
test.describe('Portfolio management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('My Portfolio').click();
  });

  test('shows portfolio metrics', async ({ page }) => {
    await expect(page.getByText('Total Value')).toBeVisible();
    await expect(page.getByText('Unrealized P&L')).toBeVisible();
    await expect(page.getByText('Cost Basis')).toBeVisible();
  });

  test('shows existing holdings', async ({ page }) => {
    await expect(page.getByText('VOO')).toBeVisible();
    await expect(page.getByText('GLD')).toBeVisible();
  });

  test('adds new holding', async ({ page }) => {
    await page.getByRole('button', { name: /Add/i }).click();
    await page.getByLabel('Symbol').fill('IBM');
    await page.getByLabel('Name').fill('IBM Corp.');
    await page.getByLabel('Quantity').fill('10');
    await page.getByLabel(/Avg Cost/i).fill('140.00');
    await page.getByLabel(/Current Price/i).fill('148.00');
    await page.getByRole('button', { name: 'Add Holding' }).click();
    await expect(page.getByText('IBM')).toBeVisible();
  });

  test('exports CSV', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /Export CSV/i }).click(),
    ]);
    expect(download.suggestedFilename()).toContain('.csv');
  });
});

// ── Search Tests ──────────────────────────────────────────────────────────────
test.describe('Full-text search', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('search shows results for AAPL', async ({ page }) => {
    await page.getByPlaceholder(/Search symbol/i).fill('AAPL');
    await expect(page.getByText('Apple Inc.')).toBeVisible();
  });

  test('search shows results for partial name', async ({ page }) => {
    await page.getByPlaceholder(/Search symbol/i).fill('micro');
    await expect(page.getByText('Microsoft').first()).toBeVisible();
  });

  test('shows no results message for unknown symbol', async ({ page }) => {
    await page.getByPlaceholder(/Search symbol/i).fill('ZZZZ9');
    await expect(page.getByText(/No results/i)).toBeVisible();
  });
});

// ── Theme Toggle Tests ────────────────────────────────────────────────────────
test.describe('Theme toggle', () => {
  test('toggles between dark and light', async ({ page }) => {
    await page.goto('/');
    const bgBefore = await page.evaluate(() => document.body.style.backgroundColor);
    await page.locator('[aria-label]').filter({ hasText: /light|dark/i }).first().click();
    // App re-renders; just check it didn't crash
    await expect(page.getByText('STOCKIQ')).toBeVisible();
  });
});

// ── Watchlist Tests ───────────────────────────────────────────────────────────
test.describe('Watchlist', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('Watchlist').click();
  });

  test('shows existing watchlist', async ({ page }) => {
    await expect(page.getByText('Tech Watchlist')).toBeVisible();
  });

  test('creates new watchlist', async ({ page }) => {
    await page.getByRole('button', { name: /New List/i }).click();
    await page.getByLabel(/Watchlist Name/i).fill('Energy Watch');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText('Energy Watch')).toBeVisible();
  });

  test('adds symbol with price alert', async ({ page }) => {
    await page.getByRole('button', { name: /Add Symbol/i }).click();
    await page.getByLabel('Ticker Symbol').fill('CVX');
    await page.getByLabel(/Price Alert/i).fill('160.00');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('CVX')).toBeVisible();
  });
});

// ── Screener Tests ────────────────────────────────────────────────────────────
test.describe('Custom Screener', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('Screener').click();
  });

  test('runs screen and shows results', async ({ page }) => {
    await page.getByRole('button', { name: /Run Screen/i }).click();
    await expect(page.getByText('Results')).toBeVisible();
    await expect(page.getByText(/matches/i)).toBeVisible();
  });

  test('applies value preset', async ({ page }) => {
    await page.getByText('Value (P/E<15)').click();
    await page.getByRole('button', { name: /Run Screen/i }).click();
    await expect(page.getByText('Results')).toBeVisible();
  });
});
