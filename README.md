# Aalto Foodsharing Website

Static single-page website for Aalto Foodsharing (A!FS), served from `index.html` (GitHub Pages, no backend/server). All page logic, translations, and markup live in `index.html`; editable content lives in `content/*.json`.

## Project structure

```
index.html          All markup + the inline <script> (translations, routing, content loaders)
tailwind.config.js   Tailwind theme (colors, fonts) + content glob (only index.html is scanned)
src/input.css        Tailwind entry point
dist/output.css       Generated CSS — must be rebuilt after changing classes in index.html
content/*.json        All editable text content (see below)
documents/            Downloadable PDFs referenced from content/audience.json
illustrations/         Icons/illustrations referenced from content JSON and inline HTML
pictures/             Timeline photos referenced from content/timeline.json
```

## Build

```
npm install
npm run build:css     # tailwindcss -i src/input.css -o dist/output.css --minify
npm run watch:css     # rebuild on save while editing locally
```

Run `build:css` after **any** change to Tailwind classes in `index.html`, since `dist/output.css` is generated/purged based on `tailwind.config.js`'s `content: ["./index.html"]`.

**Windows note:** if `npm run build:css` fails with `PSSecurityException: UnauthorizedAccess` (PowerShell execution policy blocking `npm.ps1`), call the Tailwind CLI directly instead:
```
node node_modules/tailwindcss/lib/cli.js -i src/input.css -o dist/output.css --minify
```

## Localization (EN / FI)

- Static UI strings live in the `translations` object at the bottom of `index.html` (`en` / `fi` keys). Elements tagged `data-i18n="key"` get their text replaced by `applyTranslations(lang)`.
- All content JSON files store user-facing text as `{ "en": "...", "fi": "..." }` pairs.
- The language buttons call `setLang('en' | 'fi')`, which re-renders every section and remembers the choice in `localStorage` under `afs_lang`.

## Content files (`content/`)

### `faq.json`
Array of `{ question: {en,fi}, answer: {en,fi} }`. `answer` supports Markdown.

### `locations.json`
Single source of truth for **both** the "A!FS Map" (`#network`, Leaflet map) and "Where to find us" (`#locations`, card grid). Each entry:

```jsonc
{
  "name": { "en": "...", "fi": "..." },
  "coordinates": [lat, lng],
  "url": "",                        // optional external link shown in the map popup
  "description": { "en": "...", "fi": "..." },  // Markdown; leave "" if unknown
  "type": { "en": "...", "fi": "..." },          // groups markers + builds the map legend
  "icon_path": "illustrations/....png",
  "show_where_to_find_us": true,     // also show this pin as a card under "Where to find us"?
  "image": "....png",                // only needed when show_where_to_find_us is true
  "google_maps": "https://...",      // only needed when show_where_to_find_us is true
  "open_street_map": "https://..."   // only needed when show_where_to_find_us is true
}
```

Only set `show_where_to_find_us: true` for the pins that should also appear as a card — not every marker needs one.

### `timeline.json`
Array of events: `{ year: {en,fi}, title: {en,fi}, description: {en,fi} (Markdown), type: "operations"|"network", picture_path }`, rendered in the two-column timeline.

### `audience.json`
Drives the "Join the Rescue" flow (`#join`, `#join/<key>`). Each top-level key (e.g. `foodsaver`, `foodprovider`) is one audience group:

```jsonc
{
  "title": { "en": "...", "fi": "..." },
  "subtitle": { "en": "...", "fi": "..." },
  "description": { "en": "...", "fi": "..." },   // Markdown: paragraphs, *italic*, [links](url)
  "icon_path": "illustrations/....png",
  "hyperlinks": { "Label": { "subtitle": {"en":"...","fi":"..."}, "url": "..." } },
  "files": { "Label": { "title": {"en":"...","fi":"..."}, "path": "documents/....pdf" } },
  "contact": { "Role name": ["email@..."] }
}
```

Adding a new top-level key here automatically adds a card to the `#join` selection screen and a new `#join/<key>` subpage — no HTML changes required.

### `contact.json`
Powers the `#contact` section cards: `{ "Role": { "description": {"en":"...","fi":"..."}, "mail": "..." } }`.

## Markdown in content text

Free-text fields (descriptions, answers, subtitles, link/file labels) are rendered with [marked.js](https://marked.js.org/) (loaded via CDN in `<head>`) through two helpers defined in the script:

- `mdInline(text)` — short, single-line text (no wrapping `<p>`). Supports `*italic*`, `**bold**`, `[text](url)`.
- `mdBlock(text)` — longer text where a blank line (`\n\n`) starts a new paragraph. Only use inside a `<div>` (never a `<p>`, since Markdown already emits its own `<p>` tags).

Content is authored by site maintainers in this repo (not user-submitted), so the rendered HTML is not sanitized.

## Page structure / routing

- `#home-view` wraps the normal homepage sections (hero, stats, about, FAQ, map, locations, timeline, contact). It's hidden while the "Join" flow is active.
- `#join-view` is a client-side "subpage" shown via hash routing (`#join`, `#join/<audience-key>`) — see `handleRoute()`, `showHomeView()`, `showJoinView()`, `loadJoinSelect()`, `loadJoinDetail()` in the script. There is no server-side routing; everything happens inside `index.html`, so links like `#join/foodprovider` work from anywhere on the site.
- The "About" nav item (desktop only, `hidden md:flex`) is a hover dropdown containing FAQ / Locations / Timeline.

## Backlog / ideas not yet implemented

- Dark mode (invert color palette).
- News / reporting section.
- Cross-links to other sustainability associations.
- Additional FAQ entries to draft: "How to get involved?", "How are we organised?" (levels of engagement, subgroups), "Where does Finland stand on food justice?".
- Review translation quality across all `*_fi` fields (many were machine/AI-drafted and should be proofread by a native speaker).
- Double-check page/image aspect ratios on mobile.
- Explore using more of the illustrations already in `illustrations/`.

