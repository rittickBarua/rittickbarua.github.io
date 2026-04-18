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

Merged via PR #1 as commit **`59c44c2`** ("Production-hardening-(site-hardening branch) (#1)"). A single squashed commit — `git revert 59c44c2` peels off everything. Full rollback anchor: `git reset --hard pre-site-hardening` (local tag pointing at master's pre-work head `9e65e6e`).

### Template cruft removed (46 files)

- All five Lorem-ipsum blog posts, four demo talks, two demo teaching entries, two demo portfolio items, the "Paper Title Number 5" placeholder publication, the Monocle-ipsum draft
- Ten demo pages: `archive-layout-with-content.md`, `collection-archive.html`, `markdown.md`, `non-menu-page.md`, `page-archive.html`, `portfolio.html`, `talks.html`, `talkmap.html`, `teaching.html`, `year-archive.html`
- Misleading `/terms/` page (referenced Disqus + GA that weren't enabled)
- JSON-CV path (`_pages/cv-json.md`, `_data/cv.json`, `_includes/cv-template.html`)
- Demo `_data/authors.yml`
- Upstream dev tooling: `markdown_generator/`, `talkmap.py`, `talkmap.ipynb`, `talkmap_out.ipynb`, `talkmap/`, `package.json`, `.github/workflows/scrape_talks.yml`

### Real content added

- Three proper `_publications/*.md` entries:
  - `2024-01-01-barua-dsit-cyber-security-risks-to-ai.md` (DSIT whitepaper, category: `whitepapers`)
  - `2018-01-01-colbourne-rheo-nmr-validation.md` (*J. Magn. Reson.*, DOI `10.1016/j.jmr.2017.11.010`)
  - `2014-01-01-barua-steam-explosion-sewage-sludge.md` (AquaEnviro 2014)
- `_includes/json-ld-person.html` (schema.org Person: name, jobTitle, alumniOf Cambridge, sameAs)
- `robots.txt`, `humans.txt`, proper `/404.html`
- PLACEHOLDER files with instructions for GSC and Bing HTML-file verification

### SEO wired up

- `jekyll-seo-tag` in the Gemfile + `_config.yml` plugins/whitelist
- `_includes/seo.html` emits `<title>` manually with em-dash separator (jekyll-seo-tag 2.8.0 hard-codes ` | ` in a constant, bypassed by emitting our own then `{% seo title=false %}`)
- Homepage `<title>`: `Rittick Barua, PhD — AI & Data Science Product Leader`
- Other pages: `{page.title} — {site.title}`
- `_config.yml` populated: `title`, `tagline`, `title_separator`, `description` (placeholder — see parked Q11), `og_image`, `logo`, `social.links` (Scholar / ResearchGate / GitHub / LinkedIn), `locale: en-GB`, `timezone: Europe/London`, `future: false`
- `<html lang="en-GB">`

### Fixes landed

- Profile image moved `files/` → `images/profile.jpeg` (theme hard-prepends `/images/` to avatar)
- CV PDF link made root-relative
- Theme toggle: `<a role="button">` → real `<button>` (html-proofer clean; `_sass/layout/_navigation.scss` updated with button reset)
- `footer.html` `http://github.com` / `http://jekyllrb.com` / `http://bitbucket.org` upgraded to https; external links get `target="_blank" rel="noopener noreferrer me"`
- MathJax / Plotly / Mermaid / polyfill CDN scripts removed from every page

### Content polish

- British English: `auto-summarise`, `optimising`
- `AcquEnviro` → `AquaEnviro` typo corrected
- Oxford comma restored in the bio; `cutting-edge` hyphenated
- 53-line "Ph.D in Version Control Theory, GitHub University" template block removed from `cv.md`
- 22-line fork-tutorial comment removed from `about.md`
- `README.md` and `CONTRIBUTING.md` rewritten from upstream template docs to project-specific minimal versions

### Docs committed to master

- `AUDIT.md` — Phase 0 read-only audit (pre-work state, placeholder fields, question list)
- `REPORT.md` — change log with field-level `_config.yml` diff + manual checklist

Both excluded from `_site/` via `_config.yml` `exclude:`.

---

## What's NOT on master (preserved as tag `site-hardening-e2e-unmerged` → commit `f7e87c2`)

PR #1 was merged using an earlier version of the branch. These improvements exist locally but weren't in the merged tree:

1. **`e2e/` Playwright test suite** — five specs (smoke, SEO, a11y via axe-core, assets, interactive), BASE_URL-parameterised, desktop + mobile projects. 76 pass / 2 skipped / 0 fail against `http://localhost:4000`. Pinned to Playwright 1.56.1 (matches the chatr-rp e2e setup the user asked to adapt from).
2. **Masthead hamburger nav `<button>` a11y fix** — added `type="button"` + `aria-label="Toggle navigation"` + `aria-hidden="true"` on the icon. Without this, axe reports a **critical** `button-name` violation on every page.
3. **`_pages/cv.md` heading hierarchy fix** — section headings `# Summary`, `# Professional Experience`, etc. demoted to `##` so the page has exactly one `<h1>`. Currently master has six `<h1>` elements on `/cv/`.
4. **`og:image` / `twitter:image` default** — added a site-wide `defaults: { scope: { path: "" }, values: { image: "/images/profile.jpeg" } }` in `_config.yml` because jekyll-seo-tag reads `page.image`, not `site.og_image`. Without this, no page emits an `og:image`.
5. **`docs/site-hardening.md`** — a permanent future-reference engineering log (longer form than this handoff).
6. **`TEST_REPORT.md`** — e2e results, skip justifications, coverage gaps.

To recover this work in another session:

```sh
# Option A: cherry-pick on top of master
git cherry-pick site-hardening-e2e-unmerged
# (will be a one-commit cherry because f7e87c2 is itself squashed)

# Option B: branch from the tag and PR it
git checkout -b site-hardening-followup site-hardening-e2e-unmerged
git rebase master   # fast-forward, should be conflict-free
git push -u origin site-hardening-followup
gh pr create --base master
```

**Recommendation for next session:** land items 2, 3, 4 as a short follow-up PR — they're genuine bugs surfaced by the e2e run and the fix is trivial. Items 1, 5, 6 are infrastructure/docs; less urgent but valuable.

---

## Parked decisions (not actioned)

### Q11 — site description wording

Current `_config.yml` `description:` is a 145-char placeholder:

> Product leader and applied data scientist. 7+ years taking enterprise ML and GenAI solutions from discovery to scaled adoption. Cambridge Engineering PhD.

Constraints the user gave explicitly:

- **No Azure** — keep platform-agnostic
- **No AI security research** framing
- **No location** (London etc.) — portable across roles
- Positioning toward **product owner / principal product owner** roles

Author sidebar `bio` is aliased to `description` via YAML anchor `&description`, so changing `description` also updates the sidebar strapline.

### Q13 — analytics

- User picked **Option 2: Google Analytics 4** when asked. Deferred wiring.
- Needs: (a) the `G-XXXXXXXXXX` measurement ID, (b) a decision on cookie-banner vs Consent Mode V2 "denied by default" (UK GDPR / PECR applies).
- `_config.yml` already has `analytics.provider: false` and the theme has `_includes/analytics-providers/google-analytics-4.html` ready to wire.

---

## Manual TODOs — only the user can do these

1. **GitHub Pages settings** — Settings → Pages. Confirm custom domain = `rittickbarua.com`, HTTPS enforced, source = `master` / `/ (root)`.
2. **Google Search Console** — add property `https://rittickbarua.com`, verify (either paste token into `_config.yml`'s `google_site_verification:` field, or use the HTML-file method with the real token replacing `google-site-verification-PLACEHOLDER.html`), submit sitemap, request indexing of `/`, `/publications/`, `/cv/`, and the three `/publications/<slug>/` detail pages.
3. **Bing Webmaster Tools** — same pattern; field is `bing_site_verification:`.
4. **`author.employer` review** — currently `"University of Cambridge"` (alma mater). The user's CV shows Bloch.ai as current employer (Jan 2025 – Present). The sidebar icon can read as either affiliation or current employer. User's call.
5. **Favicons** — already present in `images/` (`favicon.ico`, `favicon.svg`, `favicon-32x32.png`, `favicon-192x192.png`, `favicon-512x512.png`, `apple-touch-icon-180x180.png`, `manifest.json`). No action needed unless fresh source art is wanted.

---

## Conventions and user preferences (respect these)

- **British English** throughout. `organisation`, `colour`, `behaviour`, `centred`. `14 October 2025` date format. Single quotes for typographic consistency where the theme allows.
- **Em-dash** (`—`) as the title separator, not pipe or hyphen.
- **No AI / Claude / assistant attribution** anywhere — in commit messages, docs, or code comments. Previous work had `Co-Authored-By: Claude` trailers; they were stripped via `git filter-branch --msg-filter` before the merge.
- **No Azure / no AI security / no location** in marketing / SEO copy (per Q11 constraints).
- **Discrete, reviewable commits** during development (squashed only at merge time).
- **No analytics / tracking pixels / third-party fonts** added without explicit permission.
- **British conventions matter** — see the audit and report; e.g. `AquaEnviro` is a typo target (not `AcquEnviro`).
- **Don't invent metadata** — no fake DOIs, no fake dates. Ask.

---

## How to verify state

```sh
# From repo root:
git log -1 origin/master       # should be master HEAD
git tag -l                     # should list pre-site-hardening + site-hardening-e2e-unmerged

# Build + serve locally:
docker compose up

# Smoke tests (from repo root, against localhost:4000):
curl -sI http://localhost:4000/ | head -1              # 200
curl -s http://localhost:4000/ | grep -oE '<title>[^<]+</title>' | head -1
curl -s http://localhost:4000/sitemap.xml | grep -c '<loc>'   # expect ~9

# If the e2e suite is restored from the tag:
cd e2e
docker run --rm -v "$(pwd):/work" -w /work \
  --add-host=host.docker.internal:host-gateway \
  mcr.microsoft.com/playwright:v1.56.1-noble \
  sh -c "npm install --silent && BASE_URL=http://host.docker.internal:4000 npx playwright test"
```

---

## Rollback

- **Undo the site-hardening merge:** `git revert 59c44c2` (creates a new commit reverting all changes).
- **Pre-work master state:** `git reset --hard pre-site-hardening` (the local tag pins `9e65e6e`).
- **Recover individual files from before:** `git checkout pre-site-hardening -- <path>`.

---

## Key files to understand

- **`_includes/seo.html`** — hand-rolled `<title>` + `{% seo title=false %}`. Read the comment at the top before modifying.
- **`_includes/json-ld-person.html`** — custom Person schema reading from `site.author`, `site.logo`, `site.social.links`. Auto-stays-in-sync with `_config.yml` changes.
- **`_config.yml`** — heavily commented; structure mirrors the theme sections. Changes require `docker compose restart` (not just live-reload).
- **`AUDIT.md`** (on master) — pre-work snapshot if you need to understand why something was done.
- **`REPORT.md`** (on master) — change log with `_config.yml` field-level diff + full manual checklist.
- **`docs/site-hardening.md`** (on the unmerged tag) — longer-form engineering log, same content as REPORT but narrative.

---

## Quick references

| Item | Value |
|---|---|
| Live site | https://rittickbarua.com |
| GitHub repo | https://github.com/rittickBarua/rittickbarua.github.io |
| Merged PR | #1 |
| Merge commit | `59c44c2` |
| Pre-work anchor | tag `pre-site-hardening` → `9e65e6e` |
| Unmerged follow-up work | tag `site-hardening-e2e-unmerged` → `f7e87c2` |
| Local preview | `docker compose up` → http://localhost:4000 |
| Playwright image | `mcr.microsoft.com/playwright:v1.56.1-noble` |
