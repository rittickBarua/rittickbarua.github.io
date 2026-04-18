import { test, expect } from '@playwright/test';

/**
 * Interactive behaviour — theme toggle, nav links, link attributes.
 */

test.describe('theme toggle', () => {
  // Skipped under jekyll-serve-from-sibling-container because
  // assets/js/main.min.js is emitted as http://0.0.0.0:4000/... which the
  // Playwright container can't reach, so jQuery never loads and the click
  // handler is never bound. Covered by the a11y spec's static checks
  // (button present, aria-label correct) and by smoke review in a real
  // browser against localhost:4000. Re-enable when running against a URL
  // that matches the build-time site.url (e.g. production).
  test.skip(
    process.env.BASE_URL?.includes('host.docker.internal') ?? false,
    'skipped: sibling-container JS loading artefact; see comment'
  );
  test('click toggles data-theme between light and dark', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => typeof (window as any).jQuery !== 'undefined', undefined, { timeout: 5000 });
    const initial = await page.locator('html').getAttribute('data-theme');
    await page.locator('#theme-toggle button').click();
    await page.waitForFunction(
      (prev) => document.documentElement.getAttribute('data-theme') !== prev,
      initial,
      { timeout: 2000 }
    );
    const afterFirst = await page.locator('html').getAttribute('data-theme');
    expect(afterFirst).not.toBe(initial);
    expect(['light', 'dark']).toContain(afterFirst);
    await page.locator('#theme-toggle button').click();
    await page.waitForFunction(
      (prev) => document.documentElement.getAttribute('data-theme') !== prev,
      afterFirst,
      { timeout: 2000 }
    );
    const afterSecond = await page.locator('html').getAttribute('data-theme');
    expect(afterSecond).toBe(initial ?? 'light');
  });

  test('theme toggle button is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('#theme-toggle button');
    await expect(btn).toHaveAttribute('type', 'button');
    await expect(btn).toHaveAttribute('aria-label', /theme/i);
  });
});

test.describe('responsive', () => {
  test('desktop viewport renders masthead', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.locator('.masthead')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Publications', exact: true }).first()).toBeVisible();
  });

  test('mobile viewport renders usable layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('.masthead')).toBeVisible();
    // Author sidebar still reachable via scroll on mobile
    await expect(page.locator('.author__name').first()).toContainText('Rittick Barua, PhD');
  });
});

test.describe('external link security', () => {
  test('Scholar / ResearchGate / GitHub / LinkedIn sidebar links open in new tab', async ({ page }) => {
    await page.goto('/');
    for (const label of ['Google Scholar', 'ResearchGate', 'GitHub', 'LinkedIn']) {
      const link = page.getByRole('link', { name: new RegExp(label, 'i') }).first();
      await expect(link, label).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
      const rel = await link.getAttribute('rel');
      expect(rel, `${label} rel`).toContain('noopener');
      expect(rel, `${label} rel`).toContain('noreferrer');
    }
  });

  test('Paper buttons on publications page have target=_blank + rel', async ({ page }) => {
    await page.goto('/publications/');
    const paperLinks = page.locator('a:has-text("Paper")');
    const count = await paperLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < count; i++) {
      const link = paperLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      const rel = await link.getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });
});
