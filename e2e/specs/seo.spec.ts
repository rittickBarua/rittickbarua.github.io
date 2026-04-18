import { test, expect } from '@playwright/test';

/**
 * SEO metadata — title, description, canonical, OG, Twitter card, JSON-LD.
 */

const SITE_DEFAULT_DESC =
  'Product leader and applied data scientist. 7+ years taking enterprise ML and GenAI solutions from discovery to scaled adoption. Cambridge Engineering PhD.';

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

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('content').catch(() => null);
      const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonicalHref, 'canonical href').toBeTruthy();
      expect(canonicalHref).toMatch(/^https?:\/\//);
    });

    if (path === '/cv/' || path === '/publications/') {
      test(`${name}: has a page-specific meta description (not the site default)`, async ({ page }) => {
        await page.goto(path);
        const desc = await page.locator('meta[name="description"]').getAttribute('content');
        expect(desc, `${name} page-specific description`).not.toBe(SITE_DEFAULT_DESC);
      });
    }

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

    test(`${name}: preloads the profile avatar`, async ({ page }) => {
      await page.goto(path);
      const href = await page.locator('link[rel="preload"][as="image"]').first().getAttribute('href');
      expect(href, 'profile image preload href').toMatch(/profile\.jpeg$/);
    });

    test(`${name}: author avatar has explicit width/height`, async ({ page }) => {
      await page.goto(path);
      const img = page.locator('.author__avatar img').first();
      await expect(img).toHaveAttribute('width', /\d+/);
      await expect(img).toHaveAttribute('height', /\d+/);
    });
  });
}

// ScholarlyArticle + BreadcrumbList — only on publication detail pages.
test.describe('seo: publication detail pages', () => {
  const pubs = [
    'barua-dsit-cyber-security-risks-to-ai',
    'colbourne-rheo-nmr-validation',
    'barua-steam-explosion-sewage-sludge',
  ];

  for (const slug of pubs) {
    test(`${slug}: emits ScholarlyArticle JSON-LD with authors and publisher`, async ({ page }) => {
      await page.goto(`/publications/${slug}/`);
      const scripts = await page.locator('script[type="application/ld+json"]').all();
      let found: any = null;
      for (const s of scripts) {
        const txt = await s.textContent();
        try {
          const parsed = JSON.parse(txt || '');
          const arr = Array.isArray(parsed) ? parsed : [parsed];
          for (const obj of arr) {
            if (obj['@type'] === 'ScholarlyArticle') found = obj;
          }
        } catch {
          throw new Error(`Invalid JSON-LD on /publications/${slug}/`);
        }
      }
      expect(found, 'ScholarlyArticle present').not.toBeNull();
      expect(found.headline, 'headline').toBeTruthy();
      expect(found.author, 'authors').toBeTruthy();
      expect(Array.isArray(found.author)).toBe(true);
      expect(found.author.length).toBeGreaterThanOrEqual(1);
      expect(found.publisher?.name, 'publisher').toBeTruthy();
      expect(found.datePublished, 'datePublished').toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test(`${slug}: emits BreadcrumbList JSON-LD`, async ({ page }) => {
      await page.goto(`/publications/${slug}/`);
      const scripts = await page.locator('script[type="application/ld+json"]').all();
      let crumbs: any = null;
      for (const s of scripts) {
        const txt = await s.textContent();
        try {
          const parsed = JSON.parse(txt || '');
          const arr = Array.isArray(parsed) ? parsed : [parsed];
          for (const obj of arr) {
            if (obj['@type'] === 'BreadcrumbList') crumbs = obj;
          }
        } catch {
          throw new Error(`Invalid JSON-LD on /publications/${slug}/`);
        }
      }
      expect(crumbs, 'BreadcrumbList present').not.toBeNull();
      expect(crumbs.itemListElement?.length).toBe(3);
      expect(crumbs.itemListElement[0].name).toBe('Home');
      expect(crumbs.itemListElement[1].name).toBe('Research');
    });
  }

  test('colbourne paper: ScholarlyArticle includes DOI identifier', async ({ page }) => {
    await page.goto('/publications/colbourne-rheo-nmr-validation/');
    const html = await page.content();
    expect(html).toMatch(/"propertyID":\s*"DOI"/);
    expect(html).toMatch(/10\.1016\/j\.jmr\.2017\.11\.010/);
  });
});

test.describe('seo: sitewide', () => {
  test('sitemap.xml has expected pages and no placeholder / empty archive files', async ({ request }) => {
    const resp = await request.get('/sitemap.xml');
    expect(resp.status()).toBe(200);
    const body = await resp.text();
    expect(body).toContain('/publications/barua-dsit-cyber-security-risks-to-ai/');
    expect(body).toContain('/publications/colbourne-rheo-nmr-validation/');
    expect(body).toContain('/publications/barua-steam-explosion-sewage-sludge/');
    expect(body).not.toContain('PLACEHOLDER');
    // /categories/ and /tags/ are empty archive pages — excluded from sitemap via sitemap: false.
    expect(body).not.toMatch(/<loc>[^<]*\/categories\/<\/loc>/);
    expect(body).not.toMatch(/<loc>[^<]*\/tags\/<\/loc>/);
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
