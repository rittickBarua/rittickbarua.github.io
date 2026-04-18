# Site hardening — April 2026

Engineering log for the branch-long pass that took rittickbarua.com from a forked AcademicPages template (with placeholder content, broken profile image, and unfilled SEO metadata) to a clean, indexable personal site with a proper e2e suite guarding it.

This is a future-reference document. It's the single place to look first if you need to understand why a particular file is shaped the way it is, or how to undo any of the work.

---

## tl;dr

- Branch: `site-hardening`
- Base: `master`, anchored at the local tag `pre-site-hardening` (commit `9e65e6e`, the pre-work state)
- Landed as: a single squashed commit (so `git revert <sha>` cleanly peels off everything)
- Net change: 46 files deleted, 8 added, 14 modified, 1 moved
- Verification: `jekyll doctor` clean; `htmlproofer --disable-external` clean; Playwright e2e 76 pass / 2 skipped / 0 fail; zero critical or serious axe-core a11y violations

---

## Starting state

The live site was a template fork that happened to work. Visible problems on 15 April 2026:

- Homepage `<title>` rendered as `About - Home` (`page.title = "About"` + `site.title = "Home"`)
- Sidebar profile image pointed at `https://rittickbarua.github.io/files/profile.jpeg` — broken on the custom domain
- `<meta name="description">`, `og:image`, `twitter:*`, and JSON-LD Person schema all absent from every page (theme's custom `_includes/seo.html` guarded them behind config fields that were blank)
- 25 URLs in `/sitemap.xml`, mostly demo pages: `archive-layout-with-content`, `markdown`, `non-menu-page`, `page-archive`, five Lorem-ipsum blog posts, four demo talks, two demo teaching entries, two demo portfolio items, one "Paper Title Number 5" placeholder publication
- Duplicate permalink between `_posts/2015-08-14-blog-post-4.md` and `_posts/2199-01-01-future-post.md` (both declared `/posts/2012/08/blog-post-4/`)
- Upstream AcademicPages README, CONTRIBUTING, `package.json`, `markdown_generator/` directory, `talkmap.*` / `talkmap/` files, and a `.github/workflows/scrape_talks.yml` GitHub Action still in the repo
- Every page unconditionally loaded MathJax, Plotly, Mermaid, and an ES6 polyfill from external CDNs — none of which anything on the site used
- `<html lang="en">` (sliced from `en-US`) — wrong region for British English
- Masthead hamburger `<button><div class="navicon"></div></button>` had no accessible name (critical axe violation on every page)
- `_pages/cv.md` used `#` for every section heading, giving the CV page six `<h1>` elements
- Theme toggle used `<a role="button">` with no `href` (flagged by html-proofer, HTML-spec violation)
- `_data/authors.yml` and `_data/cv.json` carried upstream demo content ("Name Name", "Red Brick University", "GitHub University")

---

## What changed

Grouped by theme. The full field-level `_config.yml` diff is in `REPORT.md §6`.

### 1. Deleted template / demo content

**Collection files (15):** all posts, all talks, both teaching entries, both portfolio entries, the draft, and the one fake publication.

**Pages (11):** `archive-layout-with-content.md`, `collection-archive.html`, `markdown.md`, `non-menu-page.md`, `page-archive.html`, `portfolio.html`, `talks.html`, `talkmap.html`, `teaching.html`, `year-archive.html`, and the misleading `terms.md` (referenced Disqus and Google Analytics, neither enabled).

**Data / includes (4):** `_data/authors.yml`, `_data/cv.json`, `_pages/cv-json.md`, `_includes/cv-template.html` — the entire JSON-CV path was removed in favour of the real `/cv/` markdown page.

**Dev tooling (~20 files):** `markdown_generator/` directory, `talkmap.py`, `talkmap.ipynb`, `talkmap_out.ipynb`, `talkmap/` directory, `package.json`, and `.github/workflows/scrape_talks.yml`.

### 2. Added real publications

Three proper `_publications/*.md` entries, each with permalink, `paperurl`, `venue`, `citation`, and a short excerpt. The DSIT whitepaper uses a new `whitepapers` category. The JMR paper carries DOI `10.1016/j.jmr.2017.11.010`. Each now has its own detail page at `/publications/<slug>/`.

### 3. Configured SEO end-to-end

- `jekyll-seo-tag` installed in the `Gemfile`'s `:jekyll_plugins` group and registered in `_config.yml` `plugins` + `whitelist`.
- `_includes/seo.html` emits `<title>` manually with an em-dash separator (jekyll-seo-tag 2.8.0 hard-codes ` | ` in a constant), then delegates everything else to `{% seo title=false %}`.
- `_config.yml` populated: `title = "Rittick Barua, PhD"`, `tagline = "AI & Data Science Product Leader"`, `title_separator = "—"`, `locale = "en-GB"`, `timezone = "Europe/London"`, `future = false`, `og_image = "/images/profile.jpeg"`, `logo = "/images/profile.jpeg"`, plus a `social` block with `type: Person` and `links:` array (Scholar / ResearchGate / GitHub / LinkedIn) for schema.org sameAs.
- Homepage `<title>` now: `Rittick Barua, PhD — AI & Data Science Product Leader`. Other pages: `{page.title} — {site.title}`.
- `_includes/json-ld-person.html` emits a richer Person schema on every page: name, url, image, `jobTitle` (= site.tagline), `description`, `alumniOf` University of Cambridge, `sameAs` to all four social profiles. jekyll-seo-tag also emits its own Person node from `site.social`; both coexist.
- Site-wide `image: "/images/profile.jpeg"` in the `defaults` block so every page inherits an `og:image` and `twitter:image`.

### 4. Crawlability

- `robots.txt` at the repo root: `User-agent: *`, `Allow: /`, `Sitemap: https://rittickbarua.com/sitemap.xml`.
- `humans.txt` with owner + stack credit.
- `_pages/404.md` rewritten from a one-line apology into a proper 404 with links back to `/`, `/publications/`, `/cv/`, and a mailto for reporting broken inbound links. Front-matter carries `sitemap: false` so it's excluded from `/sitemap.xml`.
- `_pages/sitemap.md` (the human-readable sitemap page at `/sitemap/`) tightened: filters `site.pages` by `sitemap != false` and `title != nil`, skips empty Posts / collection sections, and carries `sitemap: false` itself so it's not indexed.
- Instructional `google-site-verification-PLACEHOLDER.html` and `BingSiteAuth-PLACEHOLDER.xml` at the repo root — both carry comments explaining the HTML-file verification flow and the alternative meta-tag flow via `_config.yml`'s `google_site_verification` / `bing_site_verification` fields. Both placeholder files are listed in `_config.yml` `exclude:` so they don't ship to `_site/` or appear in the sitemap.
- `<html lang="en-GB">` — `_layouts/default.html` now uses `{{ site.locale | default: 'en' }}` instead of the previous `slice: 0,2` that truncated the region subtag.

### 5. Accessibility and performance

- Masthead hamburger button now has `type="button"` + `aria-label="Toggle navigation"` and `aria-hidden="true"` on the decorative icon (closed a critical axe violation).
- Theme toggle converted from `<a role="button">` (no href) to a real `<button type="button" aria-label="Toggle light and dark theme">`; `_sass/layout/_navigation.scss` updated with a minimal button reset so the masthead layout is unchanged.
- `_pages/cv.md` section headings demoted from `#` to `##` so the page has exactly one `<h1>`.
- `_includes/footer/custom.html` stripped of four unused CDN scripts (MathJax, Plotly, Mermaid, polyfill) — left as scaffolding with a comment for lazy-reintroduction per-page.
- Every external link (Scholar, ResearchGate, GitHub, LinkedIn in the sidebar; Paper buttons on the Publications page; GitHub and theme-credit links in the footer) now carries `target="_blank"` and `rel="noopener noreferrer me"` (the `me` rel is a valid identity-linking annotation).
- Footer `http://github.com`, `http://jekyllrb.com`, `http://bitbucket.org` upgraded to https.

### 6. Content polish

- British English: `auto-summarise`, `optimising`.
- Publications list: `AcquEnviro` → `AquaEnviro conference proceedings — 2014` on both `/publications/` and the duplicated entry on the About page.
- Bio paragraph: Oxford comma restored in `strategy, roadmap, and adoption framework`; `cutting edge` hyphenated to `cutting-edge` (attributive compound adjective); comma added before the trailing `creating measurable impact` clause; `with 7+ years of experience in delivering` tightened to `with 7+ years of experience delivering`.
- `_pages/cv.md`: 53-line HTML-commented `Ph.D in Version Control Theory, GitHub University` template boilerplate removed from the bottom.
- `_pages/about.md`: 22-line HTML-commented fork-tutorial block removed from the bottom.
- `README.md` and `CONTRIBUTING.md` rewritten from upstream AcademicPages template docs to project-specific minimal versions.

### 7. File move

`files/profile.jpeg` → `images/profile.jpeg` (via `git mv` so history is preserved). The AcademicPages theme hard-prepends `/images/` to `author.avatar` in `_includes/author-profile.html`, so setting the avatar to any path outside `/images/` produced a doubly-prefixed 404. Moving the file to `images/` and using the bare filename in `_config.yml` is the theme convention.

### 8. Structural cleanup

- `_config.yml` stripped of dead blocks: `staticman`, `comments`, `facebook`, `twitter`, `alexa_site_verification`, `yandex_site_verification`, and the `collections.teaching`/`portfolio`/`talks` + their `defaults` scopes (collections no longer exist).
- `_data/navigation.yml` pruned from 40 lines of commented scaffolding down to a four-line list with only `Publications` and `CV`.
- `_config.yml` `exclude:` grew to keep `Gemfile.lock`, `README.md`, `CONTRIBUTING.md`, `AUDIT.md`, `REPORT.md`, `TEST_REPORT.md`, `docker-compose.yaml`, `e2e/`, and the two PLACEHOLDER files out of `_site/`.

---

## Test infrastructure

Added a small but real e2e suite under `e2e/`. Playwright + axe-core, pinned to the versions `chatr-rp` uses.

### Layout

```
e2e/
├── README.md              — how to run locally and in CI
├── package.json           — @playwright/test + @axe-core/playwright
├── playwright.config.ts   — BASE_URL-parameterised, desktop + mobile projects
├── .gitignore             — node_modules, test-results, playwright-report
└── specs/
    ├── smoke.spec.ts       — pages load, titles, nav hrefs, no console errors
    ├── seo.spec.ts         — title, description, canonical, OG, Twitter card, JSON-LD, sitemap, robots
    ├── a11y.spec.ts        — axe-core WCAG 2.1 AA on five pages + h1 counts + img alt + external-link security
    ├── assets.spec.ts      — HTTP 200 on assets; 404 on excluded files; magic-byte checks on PDF + JPEG; manifest.json parses
    └── interactive.spec.ts — theme toggle, responsive breakpoints, sidebar link attributes
```

### Running it

Local — Jekyll must be serving (`docker compose up` from the repo root):

```sh
cd e2e
docker run --rm -v "$(pwd):/work" -w /work \
  --add-host=host.docker.internal:host-gateway \
  mcr.microsoft.com/playwright:v1.56.1-noble \
  sh -c "npm install --silent && BASE_URL=http://host.docker.internal:4000 npx playwright test"
```

Production, once deployed:

```sh
cd e2e && BASE_URL=https://rittickbarua.com npx playwright test
```

The same specs run against either target; only `BASE_URL` changes.

### Deliberate coverage gaps

- **Visual regression** — no baseline screenshots. First-run noise isn't worth the signal. If you want it later, commit an initial baseline after a known-good deploy and add a `visual.spec.ts`.
- **Colour contrast** — axe's `color-contrast` rule is disabled. The palette is a design decision outside this pass's scope.
- **Production link reachability** — the suite doesn't fetch Scholar, DSIT, Cambridge-repo, or AquaEnviro externally to avoid 999/rate-limit flakes. If you want that, run html-proofer with externals enabled periodically.
- **Cookie banner / GA4** — parked; see follow-ups below.

### Two tests skip locally (by design)

`interactive.spec.ts`'s theme-toggle click test is programmatically skipped when `BASE_URL` points at `host.docker.internal` (local dev-serve). Reason: Jekyll serve embeds `http://0.0.0.0:4000/assets/js/main.min.js` as an absolute URL, and a sibling Docker container can't reach `0.0.0.0`, so jQuery never loads and the click handler never binds. The DOM structure the test was checking (button present with correct `aria-label`) is already covered by the axe scan. Re-enable once the suite runs against a URL matching the build-time `site.url` (i.e. production).

### Bash smoke (companion)

A single shell script at `/tmp/site-e2e/smoke.sh` (not committed — ephemeral) runs 56 curl-based checks covering HTTP status, redirects, page titles, meta descriptions, canonical URLs, OG/Twitter/JSON-LD presence, sitemap + robots structure, external-link attributes, CDN script absence, and academicpages/github.io leakage. Kept in `/tmp` intentionally as a quick-iteration tool; the real contract is in the Playwright suite.

---

## Rollback story

Every commit went onto `site-hardening`; `master` was untouched until merge. Three levels of revert:

1. **Most granular — don't merge.** Close PR #1 without merging. `master` stays at `9e65e6e`.
2. **Revert the merge.** `git revert <merge-commit-sha>`. Because the branch is a single squashed commit, reverting the merge commit is equivalent to reverting every change in one go.
3. **Nuclear.** `git reset --hard pre-site-hardening` on `master`, followed by `git push --force origin master`. The local tag `pre-site-hardening` pins the pre-work head (`9e65e6e`).

Specific-file recovery (useful if you want to bring back, say, one demo page): `git checkout pre-site-hardening -- <path>`.

---

## Manual checklist — things only you can do

In rough priority order.

1. **Google Search Console** — verify ownership, submit sitemap.
   - Add property `https://rittickbarua.com` at [search.google.com/search-console](https://search.google.com/search-console).
   - Either: (a) download the `google<token>.html` file GSC gives you, commit it to the repo root, push, click Verify, then delete `google-site-verification-PLACEHOLDER.html`; or (b) paste the token into `_config.yml`'s `google_site_verification:` field (simpler — no second file).
   - Once verified, submit `https://rittickbarua.com/sitemap.xml` under Sitemaps.
   - Use URL Inspection to request indexing of `/`, `/publications/`, `/cv/`, and the three `/publications/<slug>/` pages.
2. **Bing Webmaster Tools** — same pattern at [bing.com/webmasters](https://www.bing.com/webmasters) using either `BingSiteAuth.xml` or the `bing_site_verification:` meta-tag field.
3. **GitHub Pages settings** — Settings → Pages. Confirm custom domain is `rittickbarua.com`, HTTPS is enforced, source branch is `master`, folder is `/ (root)`.
4. **Finalise the site description.** Current wording in `_config.yml` (`description:`) is a 145-char placeholder. Constraints agreed during the pass: no Azure, no AI security, no location, product-leader positioning (aiming for product owner / principal product owner roles). Once you land on final copy, update `description:` and, for symmetry, the `author.bio`.
5. **Decide on analytics.** GA4 is wired-ready (`_config.yml` `analytics.provider: false`); flip to `google-analytics-4` and populate `analytics.google.tracking_id` with a `G-XXXXXXXXXX` ID. UK GDPR / PECR means non-essential cookies need prior consent — either add a banner (Klaro, CookieConsent v3) that gates GA4, or use Consent Mode V2 "denied by default" and accept lower data fidelity.
6. **Review `author.employer`.** Currently `"University of Cambridge"`, which is your alma mater. Your CV lists Bloch.ai as current employer (Jan 2025 – Present). The sidebar icon (`fa-building-columns`) could read as either "affiliation" or "current employer" depending on visitor intuition. If you want it to reflect current role, change to `"Bloch.ai"` or remove the field.
7. **Consider rationalising the publications duplication.** `_pages/publications.md` and `_pages/about.md` both hard-code the same three papers. The new `_publications/*.md` files auto-render individual detail pages, but the summary list on `/publications/` is still the hand-maintained markdown. Reasonable to keep; worth knowing.

---

## Parked decisions (for when you come back to them)

These are captured verbatim so future-you doesn't have to re-derive the constraints.

### Site description

Constraints you gave during the pass:

- No mention of Azure (keep platform-agnostic)
- No AI security research framing
- No location ("London-based" etc.)
- Positioning toward product owner / principal product owner roles

Current placeholder (pending revisit):

> Product leader and applied data scientist. 7+ years taking enterprise ML and GenAI solutions from discovery to scaled adoption. Cambridge Engineering PhD.

### Analytics

- Option 2 chosen: Google Analytics 4.
- Not wired up during this pass (both the tracking ID and the cookie-banner strategy were deferred).
- Two acceptable execution paths:
  - **Cookie banner** (Klaro / CookieConsent v3) that blocks GA4 until the visitor opts in. UK GDPR-compliant; slightly slower UX.
  - **Consent Mode V2 denied-by-default** — anonymous pings only until consent, no banner. Legal, lower data fidelity.

---

## Follow-up ideas (low priority, not in this pass)

- LaTeX → PDF CV workflow. Put `cv.tex` under `files/` and add a GitHub Action (`xu-cheng/latex-action@v3`) to compile it to `files/cv-short.pdf` on push. Avoids manually regenerating the PDF.
- Visual regression tests in Playwright. Commit baselines after a known-good deploy and add a `visual.spec.ts`.
- Simple GitHub Actions workflow to run the e2e suite on PRs:
  ```yaml
  - run: docker compose up -d
  - run: until curl -sf http://localhost:4000/ >/dev/null; do sleep 1; done
  - run: cd e2e && npm ci && npx playwright install --with-deps chromium
  - run: cd e2e && BASE_URL=http://localhost:4000 npx playwright test
  - uses: actions/upload-artifact@v4
    if: failure()
    with:
      name: playwright-report
      path: e2e/playwright-report/
  ```
- Review whether `/sitemap/` (human-readable sitemap) is worth keeping; after the cleanup it lists Publications (3) and the handful of pages. `/sitemap.xml` is what Google uses; the HTML version is cosmetic.

---

## Where to look for specifics

- **AUDIT.md** — Phase 0 read-only audit produced before any edits. Captures the exact pre-work state: Jekyll/Ruby versions, file-by-file inventory, every `_config.yml` placeholder field, the decision questions that were answered. Useful historical snapshot if you want to see why something was chosen.
- **REPORT.md** — change log. Field-level `_config.yml` diff, every file deleted / added / moved / modified with reason.
- **TEST_REPORT.md** — e2e verification results. Lists what each test covers and what is deliberately not covered.
- **`_includes/seo.html`** — the manual `<title>` block + `{% seo title=false %}` pattern. Read the comment at the top before changing it.
- **`_includes/json-ld-person.html`** — custom Person schema. Reads from `site.author`, `site.logo`, and `site.social.links`, so updating config keeps the structured data in sync automatically.
- **`e2e/README.md`** — how to re-run the test suite.
