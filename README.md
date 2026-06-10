# rommelbartolome.com

A modernized copy of [rommelbartolome.com](https://www.rommelbartolome.com) — Rommel Bartolome's personal data-science portfolio. Originally built on Google Sites; rebuilt here as a fast, dependency-free static site.

## Structure

- `index.html` — home (project highlights, career stats, companies, contact)
- `online-cv.html` — CV (skills, work experience, education, publications)
- `machine-learning.html`, `image-processing.html`, `sports-betting.html` — article listings
- 22 article pages at the same slugs as the original site (e.g. `poisson-equation-in-sports-betting.html`)
- `assets/css/style.css` — single stylesheet (responsive, automatic dark mode)
- `images.json` + `scripts/vendor_images.py` — manifest of original image URLs and the script that downloads them into `assets/img/`

## Images

Image files are vendored into `assets/img/` by the **Vendor images** GitHub Action, which runs automatically on the first push (and can be re-run from the Actions tab). After it runs, the site is fully self-contained and no longer depends on the original Google-hosted images.

## Hosting

Served with GitHub Pages from the `main` branch root. No build step required.
