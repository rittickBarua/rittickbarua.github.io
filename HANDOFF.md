# Session handoff — rittickbarua.com site hardening

Paste this into a fresh session so work picks up without re-deriving context.

---

## Repo context

- **Repo:** `rittickBarua/rittickbarua.github.io` (Jekyll source for rittickbarua.com)
- **Deploy:** GitHub Pages, auto-deploys on push to `master`, custom domain via `CNAME`
- **Theme:** AcademicPages (MIT), a fork of Minimal Mistakes
- **Build locally:** `docker compose up` (the repo's `Dockerfile` uses Ruby 3.2 because the host's system Ruby 2.6 is EOL and the Gemfile won't resolve against it). Serves on `http://localhost:4000`.
- **Live site:** `https://rittickbarua.com`

---

## What's deployed on master now

Three PRs landed:

| PR | Merge SHA | Scope |
|---|---|---|
| #1 | `59c44c2` | Core site-hardening: purge template, SEO wire-up, publications, em-dash title separator, profile image fix, https/a11y link attrs, British-English content polish |
| #2 | `6102394` | Follow-up: hamburger `<button>` aria-label, CV `# → ##` heading-hierarchy fix, site-wide `image` default for OG/Twitter, Playwright e2e suite, docs |
| #3 | `67a9fc0` | SEO v2: `ScholarlyArticle` + `BreadcrumbList` JSON-LD on publication pages, per-page meta descriptions, ORCID scaffolding, avatar width/height, profile-image preload, `/categories/` + `/tags/` removed from sitemap |

Combined, every code-doable SEO item from the analysis is on master.

### Template cruft removed (46 files)

- All five Lorem-ipsum blog posts, four demo talks, two demo teaching entries, two demo portfolio items, the "Paper Title Number 5" placeholder publication, the Monocle-ipsum draft
- Ten demo pages: `archive-layout-with-content.md`, `collection-archive.html`, `markdown.md`, `non-menu-page.md`, `page-archive.html`, `portfolio.html`, `talks.html`, `talkmap.html`, `teaching.html`, `year-archive.html`
- Misleading `/terms/` page (referenced Disqus + GA that weren't enabled)
- JSON-CV path (`_pages/cv-json.md`, `_data/cv.json`, `_includes/cv-template.html`)
- Demo `_data/authors.yml`
- Upstream dev tooling: `markdown_generator/`, `talkmap.py`, `talkmap.ipynb`, `talkmap_out.ipynb`, `talkmap/`, `package.json`, `.github/workflows/scrape_talks.yml`

### Real content added

- Three `_publications/*.md` entries:
  - `2024-01-01-barua-dsit-cyber-security-risks-to-ai.md` (DSIT whitepaper, category: `whitepapers`)
  - `2018-01-01-colbourne-rheo-nmr-validation.md` (*J. Magn. Reson.*, DOI `10.1016/j.jmr.2017.11.010`)
  - `2014-01-01-barua-steam-explosion-sewage-sludge.md` (AquaEnviro 2014)
- `_includes/json-ld-person.html` (schema.org Person: name, jobTitle, alumniOf Cambridge, sameAs)
- `robots.txt`, `humans.txt`, proper `/404.html`
- PLACEHOLDER files with instructions for Google Search Console and Bing Webmaster Tools HTML-file verification

### SEO wired up

- `jekyll-seo-tag` in the Gemfile + `_config.yml` plugins/whitelist
- `_includes/seo.html` emits `<title>` manually with em-dash separator (jekyll-seo-tag 2.8.0 hard-codes ` | ` in a constant; bypassed by emitting our own then `{% seo title=false %}`)
- Homepage `<title>`: `Rittick Barua, PhD — AI & Data Science Product Leader`
- Other pages: `{page.title} — {site.title}`
- Site-wide `defaults` scope sets `image: "/images/profile.jpeg"` so every page emits an `og:image` / `twitter:image` (jekyll-seo-tag reads `page.image`, not `site.og_image`)
- Per-page `description:` on `/cv/` and `/publications/` — targets page-specific search terms instead of inheriting the site default
- `_config.yml` populated: `title`, `tagline`, `title_separator`, `description` (placeholder — see parked Q11), `og_image`, `logo`, `social.links` (Scholar / ResearchGate / GitHub / LinkedIn), `locale: en-GB`, `timezone: Europe/London`, `future: false`
- `<html lang="en-GB">`

### Structured data (four JSON-LD blocks on publication detail pages)

- **Person** (site-wide, via `_includes/json-ld-person.html`): name, jobTitle, image, alumniOf University of Cambridge, sameAs → Scholar / ResearchGate / GitHub / LinkedIn (+ ORCID if set). Includes an ORCID `identifier` PropertyValue if `author.orcid` is populated.
- **ScholarlyArticle** (publication detail pages, via `_includes/json-ld-scholarly-article.html`): headline, authors array (derived from `authors:` front-matter), datePublished, publisher, DOI as PropertyValue + sameAs to doi.org, mainEntityOfPage.
- **BreadcrumbList** (publication detail pages, via `_includes/json-ld-breadcrumbs.html`): Home → Research → paper title.
- jekyll-seo-tag's own Person / BlogPosting / WebPage / Organization blocks coexist.

### Core Web Vitals

- Avatar `<img>` has explicit `width="500" height="500"` + `decoding="async"` — reduces CLS.
- `<link rel="preload" as="image" fetchpriority="high">` for profile image — improves LCP (sidebar avatar is above the fold on every page).
- `/categories/` and `/tags/` archive pages have `sitemap: false` — empty until blogging starts; no more diluting crawl budget.
- All CDN scripts removed; only `main.min.js` loads (theme-internal).

### A11y and perf

- Hamburger nav `<button>` has `type="button"` + `aria-label="Toggle navigation"` (closed a critical axe `button-name` violation on every page)
- Theme toggle: `<a role="button">` → real `<button>`; `_sass/layout/_navigation.scss` updated with a button reset
- `_pages/cv.md` section headings demoted from `#` to `##` so the page has exactly one `<h1>`
- Every external link has `target="_blank"` + `rel="noopener noreferrer me"`
- MathJax / Plotly / Mermaid / polyfill CDN scripts removed from every page
- Profile image moved `files/` → `images/profile.jpeg` (theme hard-prepends `/images/` to `author.avatar`)
- CV PDF link made root-relative
- `footer.html` `http://github.com` / `http://jekyllrb.com` / `http://bitbucket.org` upgraded to https

### Content polish

- British English: `auto-summarise`, `optimising`
- `AcquEnviro` → `AquaEnviro` typo corrected
- Oxford comma restored in the bio; `cutting-edge` hyphenated
- 53-line "Ph.D in Version Control Theory, GitHub University" template block removed from `cv.md`
- 22-line fork-tutorial comment removed from `about.md`
- `README.md` and `CONTRIBUTING.md` rewritten from upstream template docs to project-specific minimal versions

### Test infrastructure on master

- `e2e/` — Playwright 1.56.1 + `@axe-core/playwright` 4.10.1; specs: `smoke`, `seo`, `a11y`, `assets`, `interactive`; BASE_URL-parameterised; `chromium-desktop` + `chromium-mobile` projects. Last run: **93 pass / 2 skipped (documented) / 0 fail**.
- `seo.spec.ts` covers: per-page title / meta description / canonical / OG / Twitter / Person JSON-LD / lang / preload / avatar dimensions; publication-specific ScholarlyArticle (authors, publisher, DOI) + BreadcrumbList; sitemap structure; robots.txt; humans.txt.
- `TEST_REPORT.md` — verification results, coverage gaps, skip justifications.
- `docs/site-hardening.md` — longer-form engineering log.
- `AUDIT.md` — Phase 0 snapshot of the pre-work state.
- `REPORT.md` — change log with `_config.yml` field-level diff.

All committed to master but listed in `_config.yml` `exclude:` so none ship to `_site/`.

---

## Parked decisions (the user explicitly deferred these)

### Q11 — site description wording

Current `_config.yml` `description:` is a 145-char placeholder:

> Product leader and applied data scientist. 7+ years taking enterprise ML and GenAI solutions from discovery to scaled adoption. Cambridge Engineering PhD.

Constraints the user gave:

- **No Azure** — keep platform-agnostic
- **No AI security research** framing
- **No location** (London etc.)
- Positioning toward **product owner / principal product owner** roles

Author sidebar `bio` is aliased to `description` via YAML anchor `&description`, so updating `description` also updates the sidebar strapline.

### Q13 — analytics

- User picked **Option 2: Google Analytics 4** when asked. Deferred wiring.
- Needs: (a) the `G-XXXXXXXXXX` measurement ID, (b) a decision on cookie-banner vs Consent Mode V2 "denied by default" (UK GDPR / PECR applies).
- `_config.yml` already has `analytics.provider: false` and the theme has `_includes/analytics-providers/google-analytics-4.html` ready to wire.

---

## Manual TODOs — only the user can do these

### Search-console indexing (do this first)

1. **GitHub Pages settings** — Settings → Pages. Confirm custom domain = `rittickbarua.com`, HTTPS enforced, source = `master` / `/ (root)`.
2. **Google Search Console** — add property `https://rittickbarua.com`, verify (either paste token into `_config.yml`'s `google_site_verification:` field, or use the HTML-file method with the real token replacing `google-site-verification-PLACEHOLDER.html`), submit sitemap, request indexing of `/`, `/publications/`, `/cv/`, and the three `/publications/<slug>/` detail pages.
3. **Bing Webmaster Tools** — same pattern; field is `bing_site_verification:`.
4. **Google Rich Results Test** — test one publication URL at [search.google.com/test/rich-results](https://search.google.com/test/rich-results). Expect ScholarlyArticle + BreadcrumbList + Person to validate.

### Identity & backlinks (real SEO juice)

5. **Register an ORCID** at [orcid.org/register](https://orcid.org/register) (3 min). Once you have the ID, set `author.orcid: "https://orcid.org/XXXX-XXXX-XXXX-XXXX"` in `_config.yml` — the sidebar and Person JSON-LD pick it up automatically.
6. **Add rittickbarua.com to your profiles:**
    - LinkedIn (Edit intro → Website).
    - GitHub (Profile → Edit profile → Website URL).
    - Google Scholar (your profile → Edit → Homepage).
    - ResearchGate (Info → Contact → Website).
    - Cambridge alumni profile if applicable.
7. **Claim publications on Google Scholar.** Make sure all three are attached to your author profile so Scholar indexing is clean.

### Content (next few months)

8. **Expand publication pages.** Each `_publications/*.md` has a 1-paragraph excerpt; a 300–500 word plain-English summary ("what we found / why it matters") gives Google meaningful crawlable text and helps you rank for topic keywords, not just paper titles.
9. **Start blogging.** One real essay/month on applied AI, GenAI productisation, or AI-adoption case studies. Target phrases someone actually Googles: `AI product owner UK`, `GenAI adoption consultant`, `enterprise LLM product lead`. `_posts/` is already enabled; just drop a dated markdown file.
10. **Consider a `/consulting/` or `/services/` landing page** if you're monetising advisory time — that's where SEO converts.

### Config decisions still open

11. **`author.employer` review** — currently `"University of Cambridge"` (alma mater). Your CV shows Bloch.ai as current (Jan 2025 – Present). The sidebar icon reads as either "affiliation" or "current employer" depending on visitor intuition.
12. **Favicons** — already present in `images/` (`favicon.ico`, `.svg`, `32x32`, `192x192`, `512x512`, `apple-touch-icon-180x180.png`, `manifest.json`). No action unless you want fresh art.

### Longer-term / when you have an hour

13. **Cloudflare in front of GitHub Pages** — free tier gives you Brotli compression, HTTP/3, better TLS, edge caching, and the ability to set security headers GH Pages alone can't (HSTS, CSP, X-Content-Type-Options). DNS change + 30 min.
14. **WebP / AVIF for images** — not urgent (profile.jpeg is ~100 KB) but a nice bandwidth cut. Use `cwebp` / `avifenc` in a pre-commit or GitHub Action; wrap avatar in `<picture>`.
15. **PageSpeed Insights** ([pagespeed.web.dev](https://pagespeed.web.dev)) monthly — act on anything in the red (usually LCP, CLS).

---

## Conventions and user preferences (respect these)

- **British English** throughout. `organisation`, `colour`, `behaviour`, `centred`. `14 October 2025` date format. Single quotes for typographic consistency where the theme allows.
- **Em-dash** (`—`) as the title separator, not pipe or hyphen.
- **No AI / assistant attribution** anywhere — in commit messages, docs, or code comments. Previous work had co-author trailers; they were stripped before merge.
- **No Azure / no AI security / no location** in marketing / SEO copy (per Q11 constraints).
- **Discrete, reviewable commits** during development (squashed only at merge time).
- **No analytics / tracking pixels / third-party fonts** added without explicit permission.
- `AquaEnviro` (not `AcquEnviro`).
- **Don't invent metadata** — no fake DOIs, no fake dates. Ask.

---

## How to verify state

```sh
# From repo root:
git log -1 origin/master               # HEAD should be 6102394 or a descendant
git tag -l                             # should include pre-site-hardening

# Build + serve locally:
docker compose up                      # serves on http://localhost:4000

# Run e2e suite locally:
cd e2e
docker run --rm -v "$(pwd):/work" -w /work \
  --add-host=host.docker.internal:host-gateway \
  mcr.microsoft.com/playwright:v1.56.1-noble \
  sh -c "npm install --silent && BASE_URL=http://host.docker.internal:4000 npx playwright test"

# Run e2e against production:
cd e2e && BASE_URL=https://rittickbarua.com npx playwright test
```

---

## Rollback

- **Undo PR #3 (SEO v2) only:** `git revert 67a9fc0`
- **Undo PR #2 (follow-up) only:** `git revert 6102394`
- **Undo PR #1 (core) only:** `git revert 59c44c2`
- **Undo everything:** `git reset --hard pre-site-hardening` (the local tag pins master's pre-work head `9e65e6e`)
- **Recover a single file from before:** `git checkout pre-site-hardening -- <path>`

---

## Key files to understand

- **`_includes/seo.html`** — hand-rolled `<title>` + `{% seo title=false %}`. Read the comment at the top before modifying.
- **`_includes/json-ld-person.html`** — custom Person schema. Reads from `site.author`, `site.logo`, `site.social.links`, `site.author.orcid`. Auto-stays-in-sync with `_config.yml` changes.
- **`_includes/json-ld-scholarly-article.html`** — ScholarlyArticle schema per publication. Reads from page front-matter (`authors:`, `venue:`, `doi:`, `paperurl:`).
- **`_includes/json-ld-breadcrumbs.html`** — BreadcrumbList (Home → Research → paper title) on publication detail pages.
- **`_config.yml`** — heavily commented; structure mirrors the theme sections. Changes require `docker compose restart` (not just live-reload).
- **`AUDIT.md`** — pre-work snapshot if you need to understand why something was done.
- **`REPORT.md`** — change log with `_config.yml` field-level diff + full manual checklist.
- **`docs/site-hardening.md`** — longer-form narrative engineering log.
- **`TEST_REPORT.md`** — e2e results; lists what each test covers and what is deliberately not covered.
- **`e2e/README.md`** — how to re-run the suite locally or in CI.

---

## Quick references

| Item | Value |
|---|---|
| Live site | https://rittickbarua.com |
| GitHub repo | https://github.com/rittickBarua/rittickbarua.github.io |
| Merged PRs | [#1](https://github.com/rittickBarua/rittickbarua.github.io/pull/1), [#2](https://github.com/rittickBarua/rittickbarua.github.io/pull/2), [#3](https://github.com/rittickBarua/rittickbarua.github.io/pull/3) |
| Latest master commit | `67a9fc0` (PR #3) |
| Pre-work anchor | tag `pre-site-hardening` → `9e65e6e` |
| Local preview | `docker compose up` → http://localhost:4000 |
| Playwright image | `mcr.microsoft.com/playwright:v1.56.1-noble` |

---

## Next session, start with this

1. Pull latest master: `git pull origin master` (sanity check HEAD is at `6102394` or later).
2. Start Jekyll locally: `docker compose up`.
3. Quickly re-run e2e to confirm baseline: see commands above.
4. If picking up Q11 (description wording): the constraint list is under "Parked decisions" above. Update `_config.yml` `description:`. Re-run e2e, spot-check homepage `<meta name="description">` and sidebar bio.
5. If picking up Q13 (GA4 + banner): flip `analytics.provider` to `google-analytics-4`, add the `G-XXXXXXXXXX` ID, pick banner vs Consent Mode V2 denied-by-default. The theme include is at `_includes/analytics-providers/google-analytics-4.html`.
