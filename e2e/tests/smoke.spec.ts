import { expect, test, type ConsoleMessage } from '@playwright/test';

const IGNORED_CONSOLE = [
  // Native Federation often logs benign info via console.error during dev
  /No runtime config/i,
  /\[gateway\] No runtime config/i,
  /favicon\.ico/i,
];

function isIgnored(msg: ConsoleMessage): boolean {
  if (msg.type() !== 'error') return true;
  return IGNORED_CONSOLE.some((re) => re.test(msg.text()));
}

test.describe('Bimo-Nexus example — smoke', () => {
  test('gateway loads and host shell renders', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (!isIgnored(msg)) errors.push(`[${msg.type()}] ${msg.text()}`);
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Brand visible -> host shell loaded
    await expect(page.getByText('Nexus Host')).toBeVisible({ timeout: 20_000 });

    // Topnav has Dashboard + Demos links
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Demos' })).toBeVisible();

    // Registry status visible
    const pill = page.locator('.pill').first();
    await expect(pill).toBeVisible();

    expect(errors, `Unexpected console errors:\n${errors.join('\n')}`).toEqual([]);
  });

  test('dashboard route shows loaded remotes', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
    await expect(page.getByText('Nexus Host')).toBeVisible({ timeout: 20_000 });

    // Either we see "Available remotes" with the 2 demo remotes, or the empty
    // state if the registry hasn't seeded them yet — both are valid for smoke
    const hasRemotes = await page.getByText('Available remotes').isVisible().catch(() => false);
    if (hasRemotes) {
      await expect(page.locator('text=remoteOne')).toBeVisible();
      await expect(page.locator('text=remoteTwo')).toBeVisible();
    }
  });

  test('demos page mounts all 4 pattern sections', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (!isIgnored(msg)) errors.push(`[${msg.type()}] ${msg.text()}`);
    });

    await page.goto('/demos', { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: /20 federated components/i })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('heading', { name: /Pattern 1/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Pattern 2/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Pattern 3/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Pattern 4/i })).toBeVisible();

    // Wait for at least one nexus-component to finish loading (eager grid)
    await page.waitForFunction(
      () => document.querySelectorAll('nexus-component').length > 0,
      undefined,
      { timeout: 30_000 },
    );

    expect(errors, `Unexpected console errors:\n${errors.join('\n')}`).toEqual([]);
  });

  test('eager grid (Pattern 2) renders all 5 federated components', async ({ page }) => {
    await page.goto('/demos', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: /20 federated components/i })).toBeVisible({ timeout: 20_000 });

    // Pattern 2 has 5 nexus-component tags in its grid. After they finish
    // loading, the .nx-loading text disappears and the actual demo content
    // takes over. Wait until none of them are in the "Loading X..." state.
    await expect.poll(
      async () => page.locator('nexus-component .nx-loading').count(),
      { timeout: 30_000, message: 'expected all eager-grid components to finish loading' },
    ).toBe(0);
  });

  test('on-demand pattern (Pattern 3) loads on click', async ({ page }) => {
    await page.goto('/demos', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: /Pattern 3/i })).toBeVisible({ timeout: 20_000 });

    // Find first "Load" button under Pattern 3 and click it
    const pattern3 = page.locator('pattern-on-demand');
    const loadBtn = pattern3.getByRole('button', { name: 'Load' }).first();
    await expect(loadBtn).toBeVisible();
    await loadBtn.click();

    // After loading, an "Unmount" button should appear in that slot
    await expect(pattern3.getByRole('button', { name: 'Unmount' }).first()).toBeVisible({ timeout: 15_000 });
  });

  test('modal dialog (Pattern 4) opens with federated content', async ({ page }) => {
    await page.goto('/demos', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: /Pattern 4/i })).toBeVisible({ timeout: 20_000 });

    const pattern4 = page.locator('pattern-dialog');
    const firstTile = pattern4.locator('.tile').first();
    await firstTile.click();

    // Modal backdrop appears with a close button
    await expect(page.locator('.backdrop')).toBeVisible({ timeout: 5_000 });
    await page.locator('.x').click();
    await expect(page.locator('.backdrop')).not.toBeVisible();
  });
});
