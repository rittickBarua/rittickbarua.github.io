# Site-hardening report — rittickbarua.com

Branch: `site-hardening`, 17 commits ahead of `master`. Rollback anchor: `git reset --hard pre-site-hardening` on `master` restores the pre-work state.

---

## 1. Commit sequence (reviewable in order)

| # | SHA | Message |
|---|---|---|
| 1 | `3b48446` | `chore: remove AcademicPages demo collection content` |
| 2 | `5f39b00` | `chore: remove AcademicPages demo pages and misleading terms page` |
| 3 | `a1ca090` | `chore: remove JSON CV path and unused template author data` |
| 4 | `f45aede` | `chore: remove AcademicPages dev tooling and talks CI workflow` |
| 5 | `1bbbcb0` | `docs: replace upstream README and CONTRIBUTING with minimal versions` |
| 6 | `1e29100` | `fix: use relative paths for profile image and CV PDF` |
| 7 | `b522813` | `feat(publications): add real publication entries to the collection` |
| 8 | `b2f5a4d` | `chore: prune template cruft from about page and tighten sitemap page` |
| 9 | `f0ac606` | `feat(seo): install jekyll-seo-tag and replace custom SEO include` |
| 10 | `767cbc9` | `feat(seo): populate _config.yml and trim template cruft` |
| 11 | `40f4d8c` | `feat(seo): add Person JSON-LD and fix homepage title composition` |
| 12 | `efe56c3` | `feat(seo): add robots.txt, humans.txt, proper 404 and verification placeholders` |
| 13 | `1fc186d` | `chore(a11y, perf): set html lang to en-GB and drop unused CDN scripts` |
| 14 | `30cdeb2` | `fix(a11y): move profile image to images/ and correct avatar resolution` |
| 15 | `088199b` | `chore(a11y): add target=_blank and rel=noopener noreferrer me to external links` |
| 16 | `ce4e4d8` | `chore(content): British English fixes and AquaEnviro typo correction` |
| 17 | `9b512cf` | `chore(content): remove AcademicPages template boilerplate from CV` |

---

## 2. Files deleted (46 files)

### Demo collection content
| Path | Reason |
|---|---|
| `_posts/2012-08-14-blog-post-1.md` | Lorem-ipsum template demo |
| `_posts/2013-08-14-blog-post-2.md` | Lorem-ipsum template demo |
| `_posts/2014-08-14-blog-post-3.md` | Lorem-ipsum template demo |
| `_posts/2015-08-14-blog-post-4.md` | Lorem-ipsum template demo |
| `_posts/2199-01-01-future-post.md` | Future-dated demo; duplicate permalink w/ post-4 |
| `_drafts/post-draft.md` | "Monocle ipsum" template demo |
| `_talks/2012-03-01-talk-1.md` | Template demo ("Talk 1 on Relevant Topic in Your Field") |
| `_talks/2013-03-01-tutorial-1.md` | Template demo |
| `_talks/2014-02-01-talk-2.md` | Template demo |
| `_talks/2014-03-01-talk-3.md` | Template demo |
| `_teaching/2014-spring-teaching-1.md` | Template demo ("Teaching experience 1") |
| `_teaching/2015-spring-teaching-2.md` | Template demo |
| `_portfolio/portfolio-1.md` | Template demo ("Portfolio item number 1") |
| `_portfolio/portfolio-2.html` | Template demo |
| `_publications/2025-06-08-paper-title-number-5.md` | "Paper Title Number 5" placeholder |

### Demo pages
| Path | Reason |
|---|---|
| `_pages/archive-layout-with-content.md` | Theme markup showcase |
| `_pages/collection-archive.html` | Empty collection index |
| `_pages/markdown.md` | Upstream author's how-to-use-template guide |
| `_pages/non-menu-page.md` | "This is a page not in the menu" |
| `_pages/page-archive.html` | Auto-list of every page |
| `_pages/portfolio.html` | Drives the portfolio collection (demo) |
| `_pages/talks.html` | Talks list page (no talks) |
| `_pages/talkmap.html` | Iframe embed of talks-location map |
| `_pages/teaching.html` | Teaching list page (no teaching) |
| `_pages/year-archive.html` | Year-grouped blog archive |
| `_pages/terms.md` | Privacy page referring to Disqus and Google Analytics, neither used |

### JSON CV path
| Path | Reason |
|---|---|
| `_pages/cv-json.md` | JSON CV page; `/cv/` covers it |
| `_data/cv.json` | Demo CV data ("GitHub University" / "Red Brick University") |
| `_data/authors.yml` | Demo authors (`Name Name`, `Name2 Name2`); site uses `site.author` |
| `_includes/cv-template.html` | Consumed `cv.json`; no longer needed |

### Upstream dev tooling
| Path | Reason |
|---|---|
| `markdown_generator/` (10 files, incl. demo TSVs + Jupyter notebooks) | Bulk-generator for `_publications/*.md` and `_talks/*.md` — no longer used |
| `talkmap.py`, `talkmap.ipynb`, `talkmap_out.ipynb` | Geocoded talks onto a map |
| `talkmap/` (7 files, incl. leaflet.markercluster bundle) | Pre-rendered talk map |
| `package.json` | Upstream theme npm metadata — not used at build time |
| `.github/workflows/scrape_talks.yml` | CI regenerating `talkmap.ipynb` on `_talks/` changes |

---

## 3. Files added (8 files)

| Path | Reason |
|---|---|
| `_publications/2024-01-01-barua-dsit-cyber-security-risks-to-ai.md` | Real publication: DSIT whitepaper, 2024 |
| `_publications/2018-01-01-colbourne-rheo-nmr-validation.md` | Real publication: Rheo-NMR, J. Magn. Reson., 2018, DOI `10.1016/j.jmr.2017.11.010` |
| `_publications/2014-01-01-barua-steam-explosion-sewage-sludge.md` | Real publication: sewage-sludge AD, AquaEnviro, 2014 |
| `_includes/json-ld-person.html` | schema.org Person JSON-LD (name, url, image, jobTitle, alumniOf, sameAs) — emitted in every page head via `_includes/head/custom.html` |
| `robots.txt` | Allow all crawlers; advertise `/sitemap.xml` |
| `humans.txt` | Owner + stack credit |
| `google-site-verification-PLACEHOLDER.html` | Instructions for GSC HTML-file verification; **NOT a real token** |
| `BingSiteAuth-PLACEHOLDER.xml` | Instructions for Bing Webmaster Tools XML-file verification; **NOT a real code** |

---

## 4. Files moved

| From | To | Why |
|---|---|---|
| `files/profile.jpeg` | `images/profile.jpeg` | The theme hard-prepends `/images/` to `author.avatar`, so avatar in `files/` produced a 404. Move aligns with theme conventions; `git mv` preserved history. |

---

## 5. Files modified

| Path | Change |
|---|---|
| `Gemfile` | Added `jekyll-seo-tag` to the `:jekyll_plugins` group |
| `_config.yml` | Major rewrite — see §6 for field-level diff |
| `_data/navigation.yml` | Pruned six commented scaffold entries; only Publications + CV remain |
| `_pages/about.md` | Removed 22-line commented fork-tutorial block; removed `title:` (homepage title now driven by site.title + tagline); corrected "AcquEnviro" typo; added target/rel to Paper links; Oxford comma + hyphen fixes |
| `_pages/cv.md` | CV PDF link now root-relative; British English (`auto-summarise`, `optimising`); Oxford comma + hyphen fixes; removed 53-line commented GitHub-University template block |
| `_pages/publications.md` | Corrected "AcquEnviro" typo; added target/rel to Paper links |
| `_pages/sitemap.md` | Added `sitemap: false`; filters pages by `sitemap != false` and `title != nil`; skips empty Posts/collection sections; capitalises collection labels |
| `_pages/404.md` | Rewrote from one-line apology to a proper 404 with links to `/`, `/publications/`, `/cv/` and a mailto for broken-link reports; `sitemap: false` |
| `_includes/seo.html` | Replaced body with `{% seo %}` (jekyll-seo-tag) |
| `_includes/head/custom.html` | Includes `json-ld-person.html` |
| `_includes/footer/custom.html` | Removed MathJax, Plotly, Mermaid, and the ES6 polyfill CDN scripts |
| `_includes/author-profile.html` | Added `target="_blank" rel="noopener noreferrer me"` to external social-profile links (Scholar, ResearchGate, GitHub, LinkedIn, and all other theme-supported services) |
| `_layouts/default.html` | `<html lang="{{ site.locale | slice: 0,2 }}">` → `<html lang="{{ site.locale | default: 'en' }}">` → now renders `en-GB` |
| `README.md` | Rewrote from upstream AcademicPages template README to a project-specific one |
| `CONTRIBUTING.md` | Rewrote from upstream contributor guide to a short visitor note |

---

## 6. `_config.yml` field-level diff

| Field | Before | After | Note |
|---|---|---|---|
| `locale` | `"en-US"` | `"en-GB"` | British English; already aliased in `_data/ui-text.yml` |
| `title` | `"Home"` | `"Rittick Barua, PhD"` | Short form, used in tabs and masthead |
| `tagline` | (absent) | `"AI & Data Science Product Leader"` | Drives homepage `<title>` via jekyll-seo-tag |
| `title_separator` | `"-"` | `"—"` | Em-dash |
| `description` | `"consultant, data scientist"` | 145-char placeholder | **Q11 parked — final wording pending your review** |
| `logo` | (absent) | `"/images/profile.jpeg"` | Used by jekyll-seo-tag (Organization schema) |
| `author.avatar` | `"https://rittickbarua.github.io/files/profile.jpeg"` | `"profile.jpeg"` | Theme convention; file now at `images/profile.jpeg` |
| `author.bio` | `"consultant, data scientist"` | same as `description` | **Pending Q11 revisit** |
| `author.location` | `"London"` | `"London"` | Unchanged |
| `author.employer` | `"University of Cambridge"` | `"University of Cambridge"` | Unchanged — **see checklist item 11** |
| `author.email` | `"email@rittickbarua.com"` | `"email@rittickbarua.com"` | Unchanged (Q10) |
| `author.*` placeholders | ~30 commented blank lines | removed | Kept: `googlescholar`, `researchgate`, `github`, `linkedin` |
| `future` | `true` | `false` | No more surprises from future-dated posts |
| `timezone` | `"Etc/UTC"` | `"Europe/London"` | Matches your location for date rendering |
| `og_image` | blank | `"/images/profile.jpeg"` | Default OG share image |
| `og_description` | blank | removed | `jekyll-seo-tag` uses `site.description` |
| `social.type` | blank | `"Person"` | schema.org type |
| `social.name` | blank | `"Rittick Barua, PhD"` | |
| `social.links` | blank | `[Scholar, ResearchGate, GitHub, LinkedIn]` | `sameAs` for Person JSON-LD |
| `twitter:` block | `username: &twitter` | removed | No Twitter / X handle |
| `facebook:` block | empty fields | removed | |
| `comments:` block | empty fields + providers | removed | No commenting |
| `staticman:` block | demo config | removed | |
| `alexa_site_verification` | blank | removed | Alexa is defunct |
| `yandex_site_verification` | blank | removed | Unused |
| `analytics.provider` | `"false"` (string) | `false` (bool) | **Q13 parked — GA4 + cookie banner pending** |
| `publication_category` | books/manuscripts/conferences | + `whitepapers` | For the DSIT paper |
| `collections.teaching/portfolio/talks` | present | removed | Collections no longer exist |
| `defaults` (teaching/portfolio/talks scopes) | present | removed | |
| `plugins`, `whitelist` | 6 entries each | +`jekyll-seo-tag` | |
| `exclude` | stock list | +`Gemfile.lock`, `README.md`, `CONTRIBUTING.md`, `AUDIT.md`, `REPORT.md`, `docker-compose.yaml` | Prevents docs from shipping to `_site/` |

---

## 7. html-proofer output

**Status: not yet run** — Docker Desktop on the local machine shut down during Phase 1 work. Once you run `open -a Docker`, I will:

1. `docker compose build` (already built once; should be a no-op)
2. `docker run … jekyll build --trace`
3. `docker run … htmlproofer ./_site --disable-external=false --check-html --check-img-http --check-opengraph --ignore-status-codes "999"`
4. Fix any issue surfaced, loop until clean
5. Run `bundle exec jekyll doctor` inside the container
6. Push `site-hardening` to origin and open a PR against `master`

If you'd rather I skip htmlproofer and push straight to a PR (with the caveat that the fixes I've made have not been runtime-verified since commit `efe56c3`), tell me.

---

## 8. Your manual checklist

Things only you can action:

1. **Start Docker Desktop** (`open -a Docker`) so I can finalise html-proofer verification.
2. **Finalise site description (Q11)** — current placeholder: *"Product leader and applied data scientist. 7+ years taking enterprise ML and GenAI solutions from discovery to scaled adoption. Cambridge Engineering PhD."* Constraints you gave: no Azure, no AI security, no location, product-leader positioning.
3. **Decide on GA4 + cookie banner (Q13)** — provide the `G-XXXXXXXXXX` measurement ID and choose banner (UK GDPR-compliant) vs Consent Mode V2 "denied by default".
4. **Google Search Console verification:**
   - Visit [search.google.com/search-console](https://search.google.com/search-console) and add property `https://rittickbarua.com`.
   - Use either: (a) the HTML-file method — download the `google<token>.html` file GSC gives you, commit it to repo root, push, verify, then delete `google-site-verification-PLACEHOLDER.html`; or (b) paste the token into `_config.yml`'s `google_site_verification:` (simpler).
5. **Bing Webmaster Tools verification:** same process at [bing.com/webmasters](https://www.bing.com/webmasters), either `BingSiteAuth.xml` file or `bing_site_verification:` in config.
6. **Submit sitemap** to both GSC and Bing: the URL is `https://rittickbarua.com/sitemap.xml`.
7. **Request indexing** in GSC URL Inspection: `/`, `/publications/`, `/cv/`, and each of the three `/publications/<slug>/` detail pages.
8. **GitHub Pages settings** → Settings → Pages:
   - Custom domain: `rittickbarua.com` (confirm the DNS `A`/`ALIAS`/`CNAME` records point at GH Pages; there's already a CNAME file in the repo).
   - **Enforce HTTPS:** confirm it's ticked. If greyed out because the TLS cert is still provisioning, wait a few hours and retry.
   - Source: branch = `master`, folder = `/ (root)` — or whatever your current deploy workflow is.
9. **Review `author.employer` field** — currently `"University of Cambridge"`, which is your alma mater. Your CV lists *Bloch.ai* as the current employer (Jan 2025 – Present). The sidebar icon (fa-building-columns) could read as either "affiliation" or "current employer" — your call. I left the value unchanged to avoid changing self-presentation without explicit sign-off.
10. **Optional: rationalise the publications duplication.** `_pages/publications.md` and `_pages/about.md` both hard-code the same three papers. The new `_publications/*.md` files render individual detail pages at `/publications/<slug>/`, but the summary list on `/publications/` is still the hand-maintained markdown. Reasonable to keep; worth knowing.
11. **Favicons** — already present in `images/` (`favicon.ico`, `favicon.svg`, `favicon-32x32.png`, `favicon-192x192.png`, `favicon-512x512.png`, `apple-touch-icon-180x180.png`, `manifest.json`) and wired up via `_includes/head/custom.html`. No action needed unless you want fresh source art.

---

## 9. Parked items (revisit when ready)

- **Q11 — site description wording.** Constraints captured: no Azure, no AI security, no location, target product-leader / principal product-owner roles.
- **Q13 — GA4 + cookie-consent strategy.** No analytics wired up in this pass.

---

## 10. How to roll back

- Full revert of the branch: nothing to do — `master` is untouched.
- Nuclear "put everything back exactly as it was": `git reset --hard pre-site-hardening` on `master` (there's a local tag pointing at `9e65e6e`).
- Individual commit revert: `git revert <sha>` from the table in §1. Commits are independent and small (biggest is the `_config.yml` populate at +247/-360).
- Recover a specific deleted file: `git checkout pre-site-hardening -- path/to/file` from `master`.
