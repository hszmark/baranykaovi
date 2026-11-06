# Bárányka Keresztyén Óvoda – honlap

Static site for https://baranykaovi.hu. The contents of `honlap/` are uploaded as-is to Hostinger (Apache). There is no build step, framework or package manager. `design/terv/` is the original mockup and is not used by the site.

## Language

- Code is English: CSS classes, JS identifiers, code comments, commit messages and PR text.
- Everything visitors or staff read is Hungarian: page text, `alt` text, ARIA labels and `README.md` (the staff guide).
- Names staff see or type are Hungarian ASCII: page files (`szuloknek.html`), content folders (`kepek/galeria/kornyezetunk/`) and document files (`hazirend.pdf`).

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

Page addresses have no `.html` extension. `honlap/.htaccess` serves `/szuloknek` from `szuloknek.html` and 301-redirects `/szuloknek.html` to `/szuloknek` and `/index.html` to `/`. Internal links, `canonical`, `og:url` and `sitemap.xml` use the extensionless form (`href="szuloknek"`, `href="./"` for the home page). A page and a folder must never share a name: the server adds a trailing slash to the folder before the rewrite runs, so the page becomes unreachable. That is why the PDFs live in `fajlok/`, not `dokumentumok/`.

`honlap/kepek/og-image.png` (1200×630) shows the header logo on `--color-bg`. To regenerate it, render a 1200×630 page that loads `css/tokens.css` and `css/main.css` and shows the `.logo` markup, then screenshot it with headless Chrome (`--window-size=1200,630 --screenshot`).

## Styling

- All colors, spacing, radii, font sizes, shadows and layout widths live in `honlap/css/tokens.css`. Use the tokens and do not hard-code values in `main.css`.
- Fonts are self-hosted in `honlap/fonts/`.
- No inline `style=""` attributes, and no hex colors or px values in `main.css` except 1–3px borders. Check with `grep -nE '#[0-9a-fA-F]{3,8}\b' honlap/css/main.css` and `grep -n 'style="' honlap/*.html`.
- Media queries cannot read custom properties, so the breakpoints are literals: 48rem, 64rem and 67rem. 67rem is the measured width of the logo plus the full menu. When a menu item is added or renamed, re-measure it and update the breakpoint in `main.css` and the comment in `tokens.css`.

## Scripts and accessibility

- Every page must work without JavaScript: the menu wraps, galleries show their "Képek megtekintése" link, and documents show without dates.
- `js/menu.js`, `js/gallery.js` and `js/documents.js` are plain scripts with no modules or libraries. They bind to `data-` attributes and load with `defer`, only on the pages that use them.
- Links with `target="_blank"` carry a visually hidden „(új lapon nyílik)” note.
- Do not add a `package.json`, build step, bundler or minification.

## Documents and galleries

- Every `fajlok/*.pdf` link must point to a file that exists in `honlap/fajlok/`. The "Frissítve" date is read from the file's `Last-Modified` header by `js/documents.js`, so replacements keep the same filename.
- Gallery images are picked up automatically from the folders under `honlap/kepek/galeria/` and sorted by filename (`js/gallery.js`).
- Document filenames never contain dates; the date comes from the file itself.
- Gallery photos are JPG or WebP (never HEIC), at most about 2000px on the long edge, with an `01_`, `02_` … prefix that sets the order.

## Checking changes

- Preview with `python3 serve.py` from the repo root (http://localhost:8000/). It is `http.server` plus extensionless page addresses. Opening the files directly does not work: galleries need the folder listing and dates need `Last-Modified`.
- Check every changed page at 360, 390, 768, 1024 and 1440px, with no horizontal scrolling at 360px.
- Pages must pass the W3C Nu validator and score at least 95 for accessibility in Lighthouse.
- When a change affects how staff update the site, update `README.md` in the same commit.

## Deploying

- `honlap/.htaccess` is hidden in Finder (Cmd+Shift+.) and must be uploaded too.
- After the first upload, upload only changed files. The host stamps every uploaded file with the upload time, so re-uploading the whole folder resets every document's "Frissítve" date.
