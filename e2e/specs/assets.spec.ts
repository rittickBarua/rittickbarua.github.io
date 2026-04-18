import { test, expect } from '@playwright/test';

/**
 * Static assets — favicons, profile image, CV PDF, feed, sitemap, placeholders.
 */

test.describe('assets', () => {
  const good = [
    '/images/profile.jpeg',
    '/images/favicon.ico',
    '/images/favicon-32x32.png',
    '/images/favicon-192x192.png',
    '/images/favicon-512x512.png',
    '/images/apple-touch-icon-180x180.png',
    '/images/manifest.json',
    '/files/cv-short.pdf',
    '/feed.xml',
    '/sitemap.xml',
    '/robots.txt',
    '/humans.txt',
    '/404.html',
  ];

  for (const url of good) {
    test(`${url} returns 200`, async ({ request }) => {
      const resp = await request.get(url);
      expect(resp.status()).toBe(200);
      const len = (await resp.body()).byteLength;
      expect(len, `${url} body length`).toBeGreaterThan(0);
    });
  }

  const excluded = [
    '/google-site-verification-PLACEHOLDER.html',
    '/BingSiteAuth-PLACEHOLDER.xml',
    '/AUDIT.md',
    '/REPORT.md',
    '/Gemfile',
    '/Gemfile.lock',
    '/README.md',
  ];

  for (const url of excluded) {
    test(`${url} returns 404 (excluded from build)`, async ({ request }) => {
      const resp = await request.get(url);
      expect(resp.status()).toBe(404);
    });
  }

  test('CV PDF is valid (magic bytes %PDF)', async ({ request }) => {
    const resp = await request.get('/files/cv-short.pdf');
    const buf = await resp.body();
    const head = buf.slice(0, 4).toString();
    expect(head).toBe('%PDF');
  });

  test('profile.jpeg is a JPEG (magic bytes FF D8)', async ({ request }) => {
    const resp = await request.get('/images/profile.jpeg');
    const buf = await resp.body();
    expect(buf[0]).toBe(0xff);
    expect(buf[1]).toBe(0xd8);
  });

  test('manifest.json is valid JSON', async ({ request }) => {
    const resp = await request.get('/images/manifest.json');
    expect(resp.status()).toBe(200);
    const text = await resp.text();
    expect(() => JSON.parse(text)).not.toThrow();
  });
});
