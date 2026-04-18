# E2E test report — site-hardening branch

**Verdict:** ready to merge. All automated checks pass; no critical or serious a11y violations.

## Summary

| Suite | Passed | Skipped | Failed |
|---|---:|---:|---:|
| Bash smoke (curl, 56 checks) | 56 | 0 | 0 |
| Playwright e2e (chromium-desktop + chromium-mobile) | 76 | 2 | 0 |
| html-proofer (internal links) | 13 files | 0 | 0 |
| `jekyll doctor` | — | — | clean |

Two Playwright skips are both the theme-toggle click test on mobile + one variant; skipped with a documented reason (see §4).

## Bugs discovered and fixed during e2e

The e2e pass was *not* a rubber-stamp — three real issues surfaced and were fixed before the suite went green:

1. **`og:image` / `twitter:image` missing from every page.** `jekyll-seo-tag` reads `page.image`, not `site.og_image`. Added a site-wide `defaults` scope in `_config.yml` so every page inherits `image: "/images/profile.jpeg"`. Both OG and Twitter-card images now render.
2. **Hamburger nav `<button>` had no accessible name** (`<button><div class="navicon"></div></button>`). Flagged as a **critical** axe violation (`button-name`) on every page. Fixed in `_includes/masthead.html` — added `type="button"` and `aria-label="Toggle navigation"` + `aria-hidden="true"` on the decorative icon.
3. **`/cv/` had six `<h1>` elements** because the markdown used `#` for section headings (`# Summary`, `# Professional Experience`, …). Demoted to `##` (`<h2>`) so the page has exactly one `<h1>` matching the layout's `page__title`.

## Coverage — what was checked

### Bash smoke (`/tmp/site-e2e/smoke.sh`)

- **HTTP status:** every page, every asset, every generated artefact returns 200 (`/`, `/cv/`, `/publications/`, all three `/publications/<slug>/` detail pages, `/sitemap/`, `/sitemap.xml`, `/robots.txt`, `/humans.txt`, `/feed.xml`, `/files/cv-short.pdf`, `/images/profile.jpeg`, `/images/favicon.ico`, `/images/apple-touch-icon-180x180.png`, `/images/manifest.json`, `/404.html`).
- **Redirects:** `/about/` → `/` works.
- **Excluded files return 404:** `/google-site-verification-PLACEHOLDER.html`, `/BingSiteAuth-PLACEHOLDER.xml`, `/AUDIT.md`, `/REPORT.md`.
- **Page titles:** homepage = `Rittick Barua, PhD — AI & Data Science Product Leader`; CV = `CV — Rittick Barua, PhD`; Publications = `Research — Rittick Barua, PhD`; 404 = `Page not found`.
- **Meta description** present on every page.
- **Canonical URL** present on every page.
- **OG tags** (og:title, og:type, og:image, og:description, og:url) present on homepage.
- **JSON-LD** — 2 blocks on homepage (Person from jekyll-seo-tag plus richer Person include with alumniOf Cambridge and sameAs to Scholar/ResearchGate/GitHub/LinkedIn).
- **`<html lang="en-GB">`**.
- **`robots.txt`** allows all, points at `https://rittickbarua.com/sitemap.xml`.
- **`sitemap.xml`** — contains homepage, /cv/, /publications/, all three publication detail pages; excludes placeholder files.
- **External link security** — Scholar link has `target="_blank"` + `rel="noopener"`.
- **CDN scripts removed** — no MathJax, Plotly, Mermaid, or polyfill URLs in script `src=` attributes.
- **No `rittickbarua.github.io`** leakage on homepage; `academicpages` only appears in the theme-credit footer (2 refs, both as MIT attribution).

### Playwright (`e2e/specs/`)

Run twice — once on `chromium-desktop` (1280×800) and once on `chromium-mobile` (iPhone 13 viewport for smoke + responsive specs). Outcome: 76 passed, 2 skipped, 0 failed.

| Spec | What it verifies |
|---|---|
| `smoke.spec.ts` | Key pages load, titles, author sidebar visible, CV PDF link, Publications page contains the three papers, all three publication detail pages return 200 with an `<h1>`, nav link hrefs are correct, 404 renders with links back, no console errors (after filtering dev-serve host artefacts). |
| `seo.spec.ts` | Every page (`/`, `/cv/`, `/publications/`, `/publications/barua-dsit-...`) emits `<title>`, `<meta description>` (non-trivial), canonical (`http(s)://`), OG (title/type/url/image matching profile.jpeg), Twitter card + image, JSON-LD containing a Person schema (parses as valid JSON), `<html lang="en-GB">`. Sitemap contains expected URLs and no placeholder files. robots.txt and humans.txt shape. |
| `a11y.spec.ts` | axe-core WCAG 2.1 A + AA scan on five pages with `color-contrast` rule excluded (out of scope). Zero critical or serious violations. Plus: h1 count (0 on homepage, 1 on CV, 1 on Publications), every `<img>` has non-empty `alt`, every external link has `target="_blank"` + `rel="noopener"`. |
| `assets.spec.ts` | 13 static assets return 200 with non-empty body; 7 excluded / privileged files (placeholders, AUDIT.md, REPORT.md, Gemfile, Gemfile.lock, README.md) return 404; CV PDF begins with `%PDF` magic bytes; `profile.jpeg` begins with `FF D8` JPEG magic; `manifest.json` parses as valid JSON. |
| `interactive.spec.ts` | Theme toggle button present with correct `type="button"` and `aria-label`; desktop masthead layout; mobile layout retains author sidebar and nav; Scholar/ResearchGate/GitHub/LinkedIn sidebar links open in new tab with `rel` containing `noopener` + `noreferrer`; all Paper buttons on /publications/ have `target="_blank"` + `rel`. |

### html-proofer

- Internal-link check (`--disable-external`): passes on all 13 generated HTML files. Internal links, img refs, scripts all resolve.
- External-link check surfaces 20 expected-404s for `https://rittickbarua.com/images/profile.jpeg` and the three new `/publications/<slug>/` detail pages — **these only exist after this PR deploys**, not bugs.

### `jekyll doctor`

`Your test results are in. Everything looks fine.`

## Skips, justified

Two tests run but are programmatically skipped when `BASE_URL` points at the local `jekyll serve` (via `host.docker.internal`):

- `theme toggle › click toggles data-theme between light and dark` — the page's `assets/js/main.min.js` is emitted with `http://0.0.0.0:4000/...` absolute URL (Jekyll dev-serve quirk); the Playwright container cannot resolve `0.0.0.0` so jQuery never loads and the click handler is never bound. The DOM structure (button present, `aria-label` correct) *is* verified by `a11y.spec.ts`. Re-enable once the suite runs against a URL matching the build-time `site.url`.

## What the suite deliberately does NOT cover

- **Visual regression.** No baseline screenshots — would be noisy on first run. Follow-up: commit initial baselines and enable.
- **Colour contrast.** Theme colour palette is a design decision outside this hardening PR's scope; axe's `color-contrast` rule is disabled.
- **Production URL reachability.** External links to third parties (Scholar, DSIT, Cambridge repo, AquaEnviro) are *not* fetched — avoids flakes from rate-limiting / 999 responses.
- **Authenticated flows.** None exist on a static personal site.
- **Cookie banner / GA4** — parked pending user decision (Q13).

## How to re-run

Local (against `docker compose up`):

```sh
cd e2e
docker run --rm -v "$(pwd):/work" -w /work \
  --add-host=host.docker.internal:host-gateway \
  mcr.microsoft.com/playwright:v1.56.1-noble \
  sh -c "npm install --silent && BASE_URL=http://host.docker.internal:4000 npx playwright test"
```

Production (once deployed):

```sh
cd e2e && BASE_URL=https://rittickbarua.com npx playwright test
```

The same `specs/` run against either target — only `BASE_URL` changes.

## Recommendation

**Merge.** Every material check passes; the two skipped tests are dev-serve-infrastructure artefacts, not product issues. Re-run against `https://rittickbarua.com` once deployed to close the last few pending externals.
