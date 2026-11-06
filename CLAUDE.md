# Bárányka Keresztyén Óvoda – honlap

Static site for https://baranykaovi.hu. The contents of `honlap/` are uploaded as-is to Hostinger (Apache). There is no build step, framework or package manager. `design/terv/` is the original mockup and is not used by the site.

## Content

- All visible text is Hungarian (`lang="hu"`). Keep the existing tone and typography: „…” quotes, en dash (–) for ranges and title separators.
- The site uses no cookies and loads no external services (the Kapcsolat page states this). Do not add analytics, embeds, CDNs or remote fonts.

## Shared markup

- The header, main navigation and footer are duplicated in every `honlap/*.html` page. A change to any of them must be applied to all pages.
- The kindergarten's contact details (address, phone, email, opening hours) appear in the footer, on `kapcsolat.html` and in the JSON-LD block in `index.html`. Keep them in sync.

## Pages and SEO

When a page is added, removed or renamed:
- Update `honlap/sitemap.xml`. Set `<lastmod>` to the change date. Also bump `<lastmod>` when a page's content changes meaningfully.
- Update the main navigation and footer links on every page.
- Give the page the same `<head>` set as the others: `<title>` ("Oldal – Bárányka Keresztyén Óvoda"), `meta description`, `canonical`, the `og:*` tags and `twitter:card`. `og:title` and `og:description` match the title and description, and `canonical` and `og:url` use the absolute `https://baranykaovi.hu/` URL.

`honlap/kepek/og-image.png` (1200×630) shows the header logo on `--color-bg`. To regenerate it, render a 1200×630 page that loads `css/tokens.css` and `css/main.css` and shows the `.logo` markup, then screenshot it with headless Chrome (`--window-size=1200,630 --screenshot`).

## Styling

- All colors, spacing, radii, font sizes, shadows and layout widths live in `honlap/css/tokens.css`. Use the tokens and do not hard-code values in `main.css`.
- Fonts are self-hosted in `honlap/fonts/`.

## Documents and galleries

- Every `dokumentumok/*.pdf` link must point to a file that exists in `honlap/dokumentumok/`. The "Frissítve" date is read from the file's `Last-Modified` header by `js/documents.js`, so replacements keep the same filename.
- Gallery images are picked up automatically from the folders under `honlap/kepek/galeria/` and sorted by filename (`js/gallery.js`).
