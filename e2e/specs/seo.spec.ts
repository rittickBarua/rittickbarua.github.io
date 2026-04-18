import { test, expect } from '@playwright/test';

/**
 * SEO metadata — title, description, canonical, OG, Twitter card, JSON-LD.
 */

const pages = [
  { path: '/', name: 'homepage' },
  { path: '/cv/', name: 'cv' },
  { path: '/publications/', name: 'publications' },
  { path: '/publications/barua-dsit-cyber-security-risks-to-ai/', name: 'dsit-pub' },
];

for (const { path, name } of pages) {
  test.describe(`seo: ${name}`, () => {
    test(`${name}: emits <title>, <meta description>, canonical`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(/.+/);
      const desc = await page.locator('meta[name="description"]').getAttribute('content');
      expect(desc, 'meta description').toBeTruthy();
      expect(desc!.length).toBeGreaterThan(30);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical, 'canonical href').toBeTruthy();
      expect(canonical).toMatch(/^https?:\/\//);
    });

    test(`${name}: emits Open Graph tags`, async ({ page }) => {
      await page.goto(path);
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogTitle).toBeTruthy();
      expect(ogType).toBeTruthy();
      expect(ogUrl).toMatch(/^https?:\/\//);
      expect(ogImage, 'og:image').toMatch(/profile\.jpeg$/);
    });

    test(`${name}: emits Twitter card`, async ({ page }) => {
      await page.goto(path);
      // jekyll-seo-tag uses `name` for twitter:card and `property` for
      // twitter:image and twitter:title. Accept either selector for image.
      const card = await page.locator('meta[name="twitter:card"]').getAttribute('content');
      expect(card, 'twitter:card').toBeTruthy();
      const twImage = await page
        .locator('meta[name="twitter:image"], meta[property="twitter:image"]')
        .first()
        .getAttribute('content');
      expect(twImage, 'twitter:image').toMatch(/profile\.jpeg$/);
    });

    test(`${name}: emits JSON-LD with Person schema`, async ({ page }) => {
      await page.goto(path);
      const scripts = await page.locator('script[type="application/ld+json"]').all();
      expect(scripts.length, 'at least one JSON-LD block').toBeGreaterThanOrEqual(1);
      let foundPerson = false;
      for (const s of scripts) {
        const txt = await s.textContent();
        try {
          const parsed = JSON.parse(txt || '');
          const arr = Array.isArray(parsed) ? parsed : [parsed];
          for (const obj of arr) {
            if (obj['@type'] === 'Person') foundPerson = true;
            if (Array.isArray(obj['@graph'])) {
              for (const g of obj['@graph']) if (g['@type'] === 'Person') foundPerson = true;
            }
          }
        } catch (e) {
          throw new Error(`Invalid JSON-LD on ${path}: ${txt?.slice(0, 200)}`);
        }
      }
      expect(foundPerson, 'Person schema').toBe(true);
    });

    test(`${name}: html lang is en-GB`, async ({ page }) => {
      await page.goto(path);
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBe('en-GB');
    });
  });
}

test.describe('seo: sitewide', () => {
  test('sitemap.xml has expected pages and no placeholder files', async ({ request }) => {
    const resp = await request.get('/sitemap.xml');
    expect(resp.status()).toBe(200);
    const body = await resp.text();
    expect(body).toContain('/publications/barua-dsit-cyber-security-risks-to-ai/');
    expect(body).toContain('/publications/colbourne-rheo-nmr-validation/');
    expect(body).toContain('/publications/barua-steam-explosion-sewage-sludge/');
    expect(body).not.toContain('PLACEHOLDER');
  });

  test('robots.txt allows all and advertises sitemap', async ({ request }) => {
    const resp = await request.get('/robots.txt');
    expect(resp.status()).toBe(200);
    const body = await resp.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Sitemap: https://rittickbarua.com/sitemap.xml');
  });

  test('humans.txt is served', async ({ request }) => {
    const resp = await request.get('/humans.txt');
    expect(resp.status()).toBe(200);
    expect(await resp.text()).toContain('Rittick Barua');
  });
});
