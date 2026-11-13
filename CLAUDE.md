# rh-0-site: source of robin-hotz.com

Static HTML, CSS, and JavaScript, deployed through GitHub Pages (remote `Raaawbin/Robin-Hotz.com`, domain in `CNAME`). Everything in this repository is public once pushed.

In the full Robin Hotz workspace, read `../../CLAUDE.md` first, then its required documents in `../../RH-2-Brand-Context/`. For page work also read `../../RH-2-Brand-Context/brand-guide/website-writing.md` and `brand-style-guide.html` beside it, and the section “Website pages” in `../../RH-2-Brand-Context/04-workflows.md`.

In an isolated clone, this repository does not contain the brand context. Obtain the brand brief, voice, workflow, and relevant examples privately before writing brand copy. Do not infer the current voice from old site text, and never add private brand material to the repository.

## Map

| What | Where |
| --- | --- |
| Main pages (home, about, references, contact, links, AIwareness, imprint, privacy) | `*.html` in the root |
| All service and solution pages | `solutions/` (`index.html` is “Für Unternehmen”, `einzelcoaching.html` is “Für Individuen”) |
| Redirect pages for old addresses (keep them) | root `einzelcoaching.html`, `vision-coaching.html`, `venture-journey.html`, `vision-form.html`, and `subpages/services/` |
| Shared header and footer | `partials/` |
| Styles and scripts | `css/style.css`, `js/` (`main.js` navigation and link builders, `lang.js` language switch, `theme.js`, `contact.js`, `newsletter.js`) |
| Web-sized photos | `assets/fotos/` |
| Client logos and testimonial portraits | `assets/clients/` |
| Icons, illustrations, site logos | `assets/icons/`, `assets/images/` |
| Case studies | `subpages/case-studies/` |
| CV and terms | `subpages/documents/` |
| Rebrand in progress, not live as the main site | `subpages/Rebrand-2/` (own `style.css`, `site.js`, `theme.js`) |
| THE GOOD CHANGE subsite, built output | `subpages/the-good-change/` (source in `../rh-5-the-good-change-vorlagen/`; do not edit the HTML here) |
| Other subprojects with their own files | `subpages/fastival/`, `subpages/marketing/` |
| Old pages and logo tests, not linked | `subpages/old/`, `subpages/test/` |
| Local server, photo optimisation, interaction check, form receiver | `scripts/` (`dev-server.py`, `optimize_new_fotos.py`, `check-interactions.cjs`, `google-apps-script/vision-form.gs`) |
| Legacy mail script, not executed on GitHub Pages | `php/send.php` |

## Rules

- Inspect Git status and the relevant HTML, CSS, and JS before editing.
- German and English live together in `.lang-de` and `.lang-en` elements, switched by `js/lang.js`. Preserve this and check both languages, metadata, navigation, and mobile layout after a change.
- Internal links never end in `.html`: `about`, `solutions/#coaching`, `solutions/loop-approach`, `../` for an `index.html`. This applies to `href`, canonical, `og:url`, JSON-LD, `sitemap.xml`, and the link builders in `js/main.js` and `subpages/Rebrand-2/site.js`.
- Preview with `python3 scripts/dev-server.py` (port 8931 in `.claude/launch.json`). Python's built-in server cannot resolve the extensionless links. Opened straight from the folder (`file://`), the page scripts point links back to the `.html` files.
- Forms post to a Google Apps Script bound to a sheet in `../../RH-9-Projects/`. GitHub Pages cannot execute PHP.
- Photos: originals stay in `../../RH-2-Brand-Context/fotos/`; only optimised copies come into `assets/`. Do not move images or change URLs without updating every reference.
- Filenames containing “new” or “old” do not establish what is live. Check the navigation and `sitemap.xml`.
- This file does not authorise commits, pushes, deployment, or DNS changes. Those need Robin's explicit request in the task.
