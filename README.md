# rittickbarua.com

Source for [rittickbarua.com](https://rittickbarua.com), my personal site.

Built with [Jekyll](https://jekyllrb.com/) using the [AcademicPages](https://github.com/academicpages/academicpages.github.io) theme (MIT), a fork of Michael Rose's [Minimal Mistakes](https://mademistakes.com/work/minimal-mistakes-jekyll-theme/). Deployed automatically by GitHub Pages on pushes to `master`.

## Local build

With Docker (recommended — no system Ruby needed):

```sh
docker compose up
```

The site then serves on <http://localhost:4000> with live reload.

## Structure

- `_pages/` — standalone pages (About, CV, Publications, 404, Sitemap)
- `_publications/` — collection of academic publications
- `_config.yml` — site-wide settings (title, author, SEO)
- `_includes/`, `_layouts/`, `_sass/`, `assets/` — theme internals and overrides
- `files/` — downloadable assets (CV PDF, profile photo)
- `images/` — site images and favicons

## Licence

Theme code is MIT (see [`LICENSE`](LICENSE)). Site content (writing, CV, publications, images) is © Rittick Barua, all rights reserved.
