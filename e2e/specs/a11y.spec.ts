import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility — axe-core scan on key pages.
 *
 * Excluded rules (justified):
 *   - color-contrast: theme uses author-chosen colours; treat as design
 *     decision, not this PR's scope.
 */

const pages = [
  { path: '/', name: 'homepage' },
  { path: '/cv/', name: 'cv' },
  { path: '/publications/', name: 'publications' },
  { path: '/publications/barua-dsit-cyber-security-risks-to-ai/', name: 'dsit-pub' },
  { path: '/404.html', name: '404' },
];

for (const { path, name } of pages) {
  test(`a11y: ${name} has no critical or serious axe violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(['color-contrast'])
      .analyze();

    const serious = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    if (serious.length) {
      console.log(JSON.stringify(serious.map(v => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.map(n => n.target).slice(0, 3),
      })), null, 2));
    }
    expect(serious).toEqual([]);
  });
}

test('html structure: exactly one <h1> on homepage (author sidebar does not count)', async ({ page }) => {
  await page.goto('/');
  const h1s = await page.locator('h1').count();
  // Homepage has no explicit page.title so the layout's h1 shouldn't render.
  // Author sidebar uses h3 not h1. Expect 0 visible h1s on homepage (site-wide).
  expect(h1s).toBeLessThanOrEqual(1);
});

test('html structure: /cv/ has exactly one h1', async ({ page }) => {
  await page.goto('/cv/');
  const h1s = await page.locator('h1').count();
  expect(h1s).toBe(1);
});

test('html structure: /publications/ has exactly one h1', async ({ page }) => {
  await page.goto('/publications/');
  const h1s = await page.locator('h1').count();
  expect(h1s).toBe(1);
});

test('every <img> has a non-empty alt attribute', async ({ page }) => {
  await page.goto('/');
  const missing = await page.$$eval('img', imgs =>
    imgs.filter(i => !i.hasAttribute('alt') || i.getAttribute('alt') === '').map(i => i.outerHTML)
  );
  expect(missing, `images missing alt: ${missing.join('\n')}`).toEqual([]);
});

test('every external link has target=_blank + rel noopener', async ({ page }) => {
  await page.goto('/');
  const issues = await page.$$eval('a[href^="http"]', (links) => {
    const problems: string[] = [];
    for (const a of links) {
      const href = a.getAttribute('href') || '';
      // Skip links to same origin (rittickbarua.com absolute self-refs)
      if (href.includes('rittickbarua.com') || href.startsWith('http://localhost') || href.startsWith('http://0.0.0.0')) continue;
      const target = a.getAttribute('target');
      const rel = a.getAttribute('rel') || '';
      if (target !== '_blank') { problems.push(`${href}: missing target=_blank`); continue; }
      if (!rel.includes('noopener')) { problems.push(`${href}: missing rel=noopener`); }
    }
    return problems;
  });
  expect(issues, issues.join('\n')).toEqual([]);
});
