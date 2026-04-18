# e2e tests for rittickbarua.com

Playwright end-to-end tests covering smoke navigation, SEO metadata, accessibility (axe-core), static-asset presence, and interactive behaviour.

## Run against the local Jekyll server

First start Jekyll from the repo root:

```sh
docker compose up
```

Then in a separate shell:

```sh
cd e2e
npm install
npx playwright install chromium
npm run test:local
```

`BASE_URL` defaults to `http://host.docker.internal:4000` so the suite works from both host and container environments. Override per run:

```sh
BASE_URL=http://localhost:4000 npm test
```

## Run against production

```sh
npm run test:prod   # BASE_URL=https://rittickbarua.com
```

## What's covered

| Spec | Focus |
|---|---|
| `specs/smoke.spec.ts` | Page loads, titles, navigation, no console errors |
| `specs/seo.spec.ts` | `<title>`, `<meta description>`, canonical, OG, Twitter card, JSON-LD Person, sitemap, robots |
| `specs/a11y.spec.ts` | axe-core WCAG 2.1 AA scan on five pages; h1 count; img alt; external link security |
| `specs/assets.spec.ts` | Favicons, CV PDF, profile image, manifest, feed. Placeholder files return 404 |
| `specs/interactive.spec.ts` | Theme toggle, responsive breakpoints, external-link attributes |

## CI wiring (future)

The suite is CI-ready. A GitHub Actions workflow like the one below will run it on every PR:

```yaml
- run: docker compose up -d
- run: curl -sf http://localhost:4000/ >/dev/null  # wait for Jekyll
- run: cd e2e && npm ci && npx playwright install --with-deps chromium
- run: cd e2e && BASE_URL=http://localhost:4000 npm test
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: playwright-report
    path: e2e/playwright-report/
```

## Notes

- `color-contrast` axe rule is disabled (theme colour choices are design decisions outside this suite's scope).
- External self-references to `https://rittickbarua.com/...` during a production-URL build are not exercised locally — production-reachability lives in Search Console.
