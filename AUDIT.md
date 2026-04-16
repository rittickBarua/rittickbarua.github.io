# Phase 0 Audit — rittickbarua.com

Generated 2026-04-16 on branch `site-hardening` (off `master`, last commit `9e65e6e updates`). Working tree was clean before branching. **No files have been modified yet — this is a read-only audit.**

---

## 1. Build environment

| Item | Value |
|---|---|
| System Ruby | `2.6.10p210` at `/usr/bin/ruby` — **end-of-life** (Ruby 2.6 EOL March 2022) |
| System Bundler | `1.17.2` |
| Gemfile.lock | **Not present** (`.gitignore` excludes it — GH Pages builds from Gemfile directly) |
| Docker | Available, daemon running. Repo ships a `Dockerfile` (Ruby 3.2) + `docker-compose.yaml` |
| Other Ruby installs | None (no rbenv, asdf, or homebrew-installed Ruby) |

### Local `bundle install` result

Fails silently on system Ruby:

```
ffi-1.17.4-x86_64-darwin requires ruby version >= 3.0, < 4.1.dev, which is
incompatible with the current version, ruby 2.6.10p210
```

`bundle check` then reports *"Bundler can't satisfy your Gemfile's dependencies"*. The `bundle install` command exits 0 but no gems are installed and `jekyll` is not on PATH.

### Workaround used: Docker

Built the repo's existing `Dockerfile` (`docker compose build`) and ran the Jekyll build inside the container:

```
docker run --rm -v "$(pwd):/usr/src/app" -u 1000:1000 jekyll-site \
  bundle exec jekyll build --trace
```

**Result:** build succeeded in ~3.2s. Output in `_site/`. Only warning was a non-fatal faraday-retry notice:

```
To use retry middleware with Faraday v2.0+, install `faraday-retry` gem
```

**Question for you:** how would you like me to proceed on the Ruby front?
- (a) Keep using Docker for local builds (zero impact on your system — safest).
- (b) Install Homebrew Ruby (`brew install ruby`, lets you `bundle exec` natively) — I can walk through the commands but won't run them unsupported.
- (c) Install `rbenv` or `asdf` for versioned Rubies — same caveat.

For the rest of this task I will continue to use Docker for verification. GitHub Pages builds the live site with its own Ruby, so this is only a local-dev concern.

### Jekyll version in the bundle

The `Gemfile` pins nothing explicitly; `github-pages` resolves to the latest GH-Pages-compatible set. From the container: `jekyll 3.10.0`, `github-pages 235`, which matches what GitHub Pages actually runs today. `jekyll-feed`, `jekyll-sitemap`, `jekyll-redirect-from`, `jemoji`, `jekyll-gist`, `jekyll-paginate` are all active.

### Build warnings captured

None beyond the faraday-retry notice above. No Liquid warnings, no deprecation warnings from the build itself. **However**, the build *produces* badly-formed output (demo content leaking, wrong titles, etc.) — detailed below.

---

## 2. Collection inventory

### `_pages/` (19 files)

| File | Verdict | Reason |
|---|---|---|
| `about.md` | **Keep** (edit) | Real content. Contains a commented-out template-fork instruction block (line 37–59) to remove. |
| `cv.md` | **Keep** (edit) | Real content. Has one absolute `rittickbarua.github.io` link on line 12 → must become relative. |
| `cv-json.md` | **Decide** | Renders a CV driven by `_data/cv.json`, which is 100% demo ("GitHub University", "Red Brick University", "academicpages"). Not linked from the navbar. Prompt suggests removing. |
| `publications.md` | **Keep** (edit) | Real content. Duplicates the publication list that `_publications/` should drive. |
| `404.md` | **Keep** (rewrite) | Current body is a single apologetic sentence. Phase 3 asks for links back home + `/publications/`. |
| `sitemap.md` | **Decide** | Human-readable sitemap at `/sitemap/`. The XML sitemap from `jekyll-sitemap` is the canonical one. Linked from `_includes/footer/custom.html`. Recommend removing the page *and* the footer link. |
| `terms.md` | **Decide** | "Privacy Policy" mentioning **Disqus** (not enabled) and **Google Analytics** (not enabled, and you've told me not to add). Currently misleading. Recommend deleting — no tracking, no need. |
| `category-archive.html` | **Keep** | Theme page at `/categories/`. Will be empty once blog posts are removed but harmless. |
| `tag-archive.html` | **Keep** | Same — `/tags/`. Harmless when empty. |
| `archive-layout-with-content.md` | **Delete** | Template demo ("Archive Layout with Content", Lorem-esque markup showcase). In live sitemap. |
| `collection-archive.html` | **Delete** | Empty archive index. In live sitemap. |
| `markdown.md` | **Delete** | Template author's documentation page. In live sitemap. |
| `non-menu-page.md` | **Delete** | Template demo. In live sitemap. |
| `page-archive.html` | **Delete** | Auto-generated list of every page. In live sitemap. |
| `portfolio.html` | **Delete** | You have no portfolio — drives `_portfolio/` collection (demo). |
| `talks.html` | **Delete** | You have no talks. |
| `talkmap.html` | **Delete** | Embeds `/talkmap/map.html` iframe, references external notebook. |
| `teaching.html` | **Delete** | You have no teaching entries. |
| `year-archive.html` | **Delete** | Year-grouped blog archive; empty after posts are removed. |

### `_posts/` (5 files) — all demo

- `2012-08-14-blog-post-1.md` — "Blog Post number 1", Lorem ipsum.
- `2013-08-14-blog-post-2.md` — "Blog Post number 2", Lorem ipsum.
- `2014-08-14-blog-post-3.md` — "Blog Post number 3", Lorem ipsum.
- `2015-08-14-blog-post-4.md` — "Blog Post number 4", Lorem ipsum. *(Your prompt referenced `2012-08-14-blog-post-4.md`; the actual filename is `2015-08-14`. Same content.)*
- `2199-01-01-future-post.md` — "Future Blog Post", `future: true`.

**Bug note:** `2015-08-14-blog-post-4.md` and `2199-01-01-future-post.md` both declare `permalink: /posts/2012/08/blog-post-4/` — a duplicate permalink collision. Only visible because `future: true` is on in config. All five should go.

### `_drafts/` (1 file)

- `post-draft.md` — "Draft Post", Monocle ipsum. **Delete.**

### `_publications/` (1 `.md` + 3 real PDFs)

- `2025-06-08-paper-title-number-5.md` — "Paper Title Number 5, with math $$E=mc^2$$", `paperurl: http://academicpages.github.io/files/paper3.pdf`, citation `"Your Name, You."`. **Delete.**
- `Barua_et_al_2024_Cyber_security_risks_to_AI.pdf` — real, keep.
- `Colbourne_et_al_2018_Validation of a low field Rheo-NMR instrument and application to shear-induced.pdf` — real, keep.
- `Barua_et_al_2012_The effects of steam explosion at different pressure on digestibility of sewage.pdf` — real, keep. (Filename says 2012 but paper published 2014; matches your live page — **confirm the date**.)

No proper per-publication `.md` files exist for the three real papers. Phase 1 will create them so the `/publications/` collection archive actually surfaces them.

**Metadata I'll use (please confirm / correct — I will NOT invent DOIs):**

| Paper | Year | Venue | URL (from `_pages/publications.md` today) |
|---|---|---|---|
| Barua, McCay, Al-Khalidi, Peng, Crossman-Smith — *Cyber security risks to artificial intelligence (Whitepaper)* | 2024 | Department for Science, Innovation and Technology (DSIT) | `https://assets.publishing.service.gov.uk/media/664333b1ae748c43d3793a40/Cyber_security_risks_to_artificial_intelligence.pdf` |
| Colbourne, Blythe, Barua, Lovett, Mitchell, Sederman, Gladden — *Validation of a low field Rheo-NMR instrument and application to shear-induced migration of suspended non-colloidal particles in Couette flow* | 2018 | *Journal of Magnetic Resonance* | Cambridge repository: `https://www.repository.cam.ac.uk/bitstreams/57073ea8-f6f6-4495-81e5-75c509654f74/download` |
| Barua, Lee, Mills, Ouki, Thorpe — *The effects of steam explosion and hydrolysing time on the digestibility of sewage sludge in anaerobic digestion* | 2014 | AquaEnviro conference proceedings | `https://conferences.aquaenviro.co.uk/proceedings/the-effects-of-steam-explosion-and-hydrolysing-time-on-the-digestibility-of-sewage-sludge-in-anaerobic-digestion` |

**Questions:**
1. Your prompt lists venue *AcquEnviro*; the live site says *AcquEnviro - 2014*. Correct spelling is **AquaEnviro** (water-sector conferences org). Fix the typo?
2. Do you have a DOI for the JMR 2018 paper? (Common format `10.1016/j.jmr.2018.XX.XXX`.) If yes, share; else I'll omit.
3. Is the JMR journal info *2018, volume/issue/page* something you want included in the citation string? I can leave it vague without invention.

### `_talks/` (4 files) — all demo

- `2012-03-01-talk-1.md` — "Talk 1 on Relevant Topic in Your Field", venue "UC San Francisco, Department of Testing".
- `2013-03-01-tutorial-1.md` — "Tutorial 1...", "UC-Berkeley Institute for Testing Science".
- `2014-02-01-talk-2.md` — "Talk 2...", "London School of Testing".
- `2014-03-01-talk-3.md` — "Conference Proceeding talk 3...", "Testing Institute of America".

All four to delete. Collection is already `output: false` in config and not linked from nav, but files on disk are still distributed with the repo.

### `_teaching/` (2 files) — both demo

- `2014-spring-teaching-1.md` — "Teaching experience 1", "University 1, Department".
- `2015-spring-teaching-2.md` — "Teaching experience 2", ditto.

Both to delete.

### `_portfolio/` (2 files) — both demo

- `portfolio-1.md` — "Portfolio item number 1".
- `portfolio-2.html` — "Portfolio item number 2".

Both to delete.

---

## 3. `_config.yml` — placeholder / problem fields

The file has been partially populated. Below is every line that is still wrong, misleading, or using a template default:

| Line | Field | Current value | Issue |
|---|---|---|---|
| 10 | `locale` | `"en-US"` | You use British English. Should be `"en-GB"` so `<html lang="en">` stays correct *and* downstream (dates etc.) reads as UK. |
| 12 | `title` | `"Home"` | This is *the site title*, appended to every page title via `jekyll-seo-tag`. Should be `"Rittick Barua, PhD"`. This is why the homepage currently renders `<title>About - Home</title>`. |
| 15 | `description` | `"consultant, data scientist"` | Too short, lowercase, not British-English tone. Also, nothing is emitting a `<meta name="description">` on the homepage today (see §5). Needs a ~155-char sentence. |
| 26 | `author.avatar` | `"https://rittickbarua.github.io/files/profile.jpeg"` | **Broken in production** — browser CORS/mixed-host oddities, and simply wrong because the site is on `rittickbarua.com`. Must be `"/files/profile.jpeg"`. |
| 29 | `author.bio` | `"consultant, data scientist"` | Same issue as description; needs a proper bio. |
| 33 | `author.email` | `"email@rittickbarua.com"` | **Confirm this is real.** It's publicly displayed via the `fa-envelope` link. If placeholder, provide a real one or remove the field. |
| 36–77 | `author.*` (many) | Blank or commented placeholders (`arxiv`, `orcid`, `bluesky`, `twitter`, etc.) | Theme skips blank ones so they don't render — technically fine, but the `#` commented placeholder values (e.g. `# example: "she/her"` on `pronouns`) add noise. I'll clean to keep only the fields you actually use: `googlescholar`, `researchgate`, `github`, `linkedin`. |
| 73 | `author.twitter` | `# Username for X / Twitter` | Per your instruction: you have no Twitter/X. Remove the field rather than leave as a commented placeholder. Same for `bluesky`. |
| 95 | `future` | `true` | Surfaces the 2199 future-dated post. After we delete the post, can stay `true` or flip to `false`; I'd default to `false` to avoid surprises. |
| 130 | `google_site_verification` | blank | Phase 3 — leave blank, document in checklist how to fill in. |
| 131 | `bing_site_verification` | blank | Same. |
| 132 | `alexa_site_verification` | blank | Alexa is defunct. Remove entirely. |
| 133 | `yandex_site_verification` | blank | Only fill if you actually use Yandex. Probably remove. |
| 136–150 | `twitter:`, `facebook:`, `og_image`, `og_description`, `social:` block | All blank | This is *why* no Twitter card, no OG image, no JSON-LD Person schema ever renders. I'll populate `og_image` (profile photo), `og_description` (site description), `social.type: Person`, `social.name`, `social.links:` array with Scholar/LinkedIn/GitHub/ResearchGate URLs. Leave `twitter:` entirely absent. |
| 155 | `analytics.provider` | `"false"` (string!) | A non-empty string is truthy in Liquid. The `analytics.html` partial then falls through with no match, so nothing renders today — but this is luck, not design. Should be `false` (boolean) or omit. Per instruction I will *not* add Google Analytics. |
| 219 | `collections.teaching.output` | `false` | Good — not currently indexed. After deleting `_teaching/` entirely, whole block can go. |
| 220 | `collections.portfolio.output` | `false` | Same. |
| 229 | `collections.talks.output` | `false` | Same. |
| 308, 317 | `plugins:`, `whitelist:` | Lists lack `jekyll-seo-tag` and `jekyll-include-cache` | Phase 2 will add `jekyll-seo-tag`. |

**Other config smells (non-blocking):**

- Line 16 comment *"changed from rittickbarua.github.io to rittickbarua.com to avoid CORS"* — CORS isn't the right term for a static site; this was a canonical-URL fix. I'll rewrite the comment for clarity.
- `staticman:` block (lines 108–123) configures a commenting service you don't use. Safe to delete.
- `comments:` block (lines 98–107) all blank / unused. Safe to delete.
- `category_archive`, `tag_archive` (lines 334–339) — referenced by `_pages/category-archive.html`/`tag-archive.html`. Keep.

### `_data/authors.yml`

Pure template demo (`Name Name`, `name@name.com`, `Name2 Name2`). Nothing on the site uses it (author comes from `site.author` in `_config.yml`). **Delete.**

### `_data/cv.json`

Demo JSON-Resume data ("Your Sidebar Name", "GitHub University", "Red Brick University", `https://academicpages.github.io`). Drives `/cv-json/` via `_includes/cv-template.html`. Since you already have a proper markdown CV at `/cv/` and it's the only CV linked in the navbar, recommend **deleting `_data/cv.json`, `_pages/cv-json.md`, and `_includes/cv-template.html`**. Confirm?

### `_data/ui-text.yml` — keep

Theme-internal i18n strings. Used by `en` locale (and after config change, still used — Liquid `site.data.ui-text[site.locale]` with `en-GB` would miss; I'll alias `en-GB` to the same block, or just set locale to `en` for theme lookup and `en-GB` on the `<html>` tag via layout. Will handle in Phase 2.)

---

## 4. `CNAME`

```
rittickbarua.com
```

Exactly one line, no protocol, no trailing newline artefacts, no `www`. **Correct.** No change needed.

---

## 5. Crawlability / meta files

| File | Status | Notes |
|---|---|---|
| `robots.txt` | **Missing** | Phase 3 will create it. |
| `sitemap.xml` | Generated by `jekyll-sitemap` at build time. **Leaking 25 URLs today**, incl. `/archive-layout-with-content/`, `/collection-archive/`, `/markdown/`, `/non-menu-page/`, `/page-archive/`, `/portfolio/`, `/talks/`, `/teaching/`, `/talkmap.html`, `/year-archive/`, five demo posts, one demo paper, `/terms/`, `/sitemap/`. Phase 1 cleanup fixes this. |
| `feed.xml` | Generated by `jekyll-feed`. Currently lists all five demo blog posts. Fine once posts are deleted. |
| `humans.txt` | **Missing** | Phase 3 — optional, will add a small one. |
| `404.html` | Exists at `_site/404.html`, produced from `_pages/404.md`. Body is one sentence. Phase 3 improves it. |
| `favicon.ico`, `apple-touch-icon-180x180.png`, `manifest.json`, `favicon.svg`, `favicon-32x32.png`, `favicon-192x192.png`, `favicon-512x512.png` | **Already present** in `images/`, wired up via `_includes/head/custom.html`. Good. |
| `google-site-verification.*` | Missing — Phase 3 will add placeholder. |

**Current homepage metadata reality check** (from `_site/index.html`):

- `<title>` is `About - Home` — as reported. Caused by `page.title="About"` + `site.title="Home"` joined by ` - `.
- `<meta name="description">` — **not emitted at all.** The theme's `_includes/seo.html` only emits it when `page.excerpt` or `site.og_description` is set; neither is.
- `<meta property="og:description">` — same.
- `<meta property="og:image">` — not emitted (no `site.og_image`, no `page.header.image`).
- JSON-LD Person schema — not emitted (the `_includes/seo.html` only does it when `site.social` is populated; it isn't).
- JSON-LD Organization schema — not emitted.
- `<meta name="twitter:card">` — not emitted (no `site.twitter.username`).

All of the above is fixed by Phase 2 config work and (if you approve) swapping the theme's custom `_includes/seo.html` for `jekyll-seo-tag` + a small custom `json-ld-person.html` include. I'll flag the tradeoffs before making that change.

---

## 6. Cross-repo references to `github.io` / `academicpages`

Grep results for `rittickbarua.github.io`:

- `_config.yml:16` — comment only.
- `_config.yml:19` — `repository: "rittickbarua/rittickbarua.github.io"` — this is the actual GH repo slug; keep as-is.
- `_config.yml:26` — `author.avatar` — **broken path**, needs `/files/profile.jpeg`.
- `_data/navigation.yml:17` — commented-out URL, delete.
- `_pages/cv.md:12` — download button href, needs `/files/cv-short.pdf`.

Grep for `academicpages`:

- `_pages/about.md:43` — inside the commented-out template boilerplate block (to be removed anyway).
- `_pages/markdown.md` — whole page gets deleted.
- `_pages/talkmap.html` — gets deleted.
- `_publications/2025-06-08-paper-title-number-5.md` — gets deleted.
- `_data/cv.json` — gets deleted (pending your OK).
- `_includes/footer.html:23` — credit line *"Powered by Jekyll & AcademicPages"*. This is the theme attribution; I'll keep it (it's MIT licence courtesy) but the link is `https://github.com/academicpages/academicpages.github.io` and remains a live external link. OK to keep.
- `README.md`, `CONTRIBUTING.md` — template docs. README currently is the upstream README with a screenshot and a fork guide; doesn't affect the live site but is the face of the repo on GitHub. Rewrite to something minimal — agreed?
- `markdown_generator/*` (whole dir), `talkmap.py`, `talkmap.ipynb`, `talkmap_out.ipynb`, `talkmap/` — dev tools, not site content. Proposed delete.
- `package.json` — upstream theme package metadata, `homepage` points at `academicpages/...`. Not used at build time. Either rewrite or delete (nothing in the repo actually runs `npm`). Proposed delete.
- `.github/workflows/scrape_talks.yml` — CI to regenerate talkmap from `_talks/`. Useless once talks are gone. Proposed delete.

---

## 7. Third-party JS currently loaded on every page

`_includes/footer/custom.html` unconditionally loads, on every page:

- `polyfill.min.js` from `cdnjs.cloudflare.com`
- `mathjax@3` from `cdn.jsdelivr.net`
- `plotly.js@3.0.1` from `cdnjs.cloudflare.com` (≈3 MB minified)
- `mermaid@11` ES module from `cdn.jsdelivr.net`

All `defer`ed, so they don't block paint — but they *are* network requests to third parties on every page load, and `plotly` is heavy. **Nothing on the current site uses any of them.** Per your constraint *"no third-party fonts added without asking"*, I'd like to pull these too. Options:

- (a) Remove all four (simplest; your site is pure HTML/CSS/markdown today).
- (b) Keep MathJax only (in case you ever embed `$$E=mc^2$$` somewhere). Still a CDN request.
- (c) Lazy-load only on pages where front-matter declares them needed.

Recommend (a); reintroduce later when you write a post that needs them. Confirm?

---

## 8. Miscellaneous

- `Gemfile` explicitly pins `connection_pool`, `'2.5.0'` and `webrick`. Probably workarounds for older bundler. After Phase 2 I'll see if they can be loosened — but not touching now.
- `package.json` has a React/Jekyll-adjacent scripts section — nothing in CI or the build uses it. Proposing delete.
- `scripts/` dir — listed but I haven't inspected in depth; I'll read before deciding in Phase 1.
- `Dockerfile` — useful (I'm using it). Keep.
- `.devcontainer/` — unexamined. Will not modify.
- `_pages/sitemap.md` links to `{{ base_path }}/sitemap.xml`. After removing the page, I'll remove the footer link too (`_includes/footer/custom.html` line 3).

---

## 9. Decisions I need from you before Phase 1

1. **OK to delete these?** All five `_posts/*`, all four `_talks/*`, both `_teaching/*`, both `_portfolio/*`, `_drafts/post-draft.md`, `_publications/2025-06-08-paper-title-number-5.md`.
2. **OK to delete these pages?** `archive-layout-with-content.md`, `collection-archive.html`, `markdown.md`, `non-menu-page.md`, `page-archive.html`, `portfolio.html`, `talks.html`, `talkmap.html`, `teaching.html`, `year-archive.html`.
3. **`/cv-json/` + `_data/cv.json` + `_includes/cv-template.html`** — delete the whole JSON-CV path?
4. **`/terms/`** — delete (it mentions Disqus and Google Analytics you don't use)?
5. **`/sitemap/` HTML page** — delete (XML sitemap is the one Google uses)?
6. **`markdown_generator/`, `talkmap.*`, `talkmap/`, `package.json`, `.github/workflows/scrape_talks.yml`** — delete all?
7. **`_data/authors.yml`** — delete (unused demo)?
8. **Third-party CDN scripts in footer** (MathJax / Plotly / Mermaid / polyfill) — drop all?
9. **Publications metadata** — confirm the three entries and answer the AquaEnviro spelling + DOI questions in §2.
10. **Email** `email@rittickbarua.com` — real, or placeholder?
11. **Description for config + homepage** — my draft for your approval (≈155 chars): *"Applied AI & data-science lead. 7+ years delivering enterprise ML and GenAI on Azure; Cambridge Engineering PhD; London-based; AI security research."* OK / edit?
12. **Homepage `<title>`** — my draft: `Rittick Barua, PhD — Applied AI & Data Science`. OK / edit?
13. **Analytics** — stay off, per your constraint. Confirm?
14. **README.md** rewrite to a minimal "personal site, source for rittickbarua.com" — OK?

Once you give me the greens I'll move to Phase 1 and start deleting/editing in logical commits.
