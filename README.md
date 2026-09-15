# Homepilato Studio

A complete, dependency-free storefront frontend with an interactive coloring room. Built for the brief in this repository: a bold Aardvark-inspired homepage and a quiet, region-based coloring experience inspired by Where Colors Dream.

## Run locally

Requires Node.js 20 or newer.

```sh
npm run dev
```

Open http://localhost:3000. No installation is needed to run or build the site.

```sh
npm run build
```

Upload `dist/` to any static host. On Vercel choose **Other**, build command `npm run build`, output directory `dist`. On Netlify use the same build/output settings. Hash routes make deep linking work on static hosting without server rewrites.

## What works

- Yellow full-viewport hero, oversized typography, floating book covers, capsule navigation.
- Four original demo book editions, category filtering, product detail routes, six sample pages per book.
- Fullscreen native dialog with desktop two-page spread and mobile single-page view.
- Eight-color palette; mouse, touch, and keyboard painting of individual closed SVG regions.
- Sequential per-region automatic coloring, undo, reset, before/after slider, page navigation and swipe.
- Device-local coloring persistence and wishlist; SVG artwork and printable downloads.
- Search, original printables, a three-step vehicle drawing activity, FAQs and privacy information.
- Responsive styling, reduced-motion support, focus management, labels and live announcements.

## Tests

```sh
npm ci
npm test
```

The DOM integration test covers category filtering, opening previews, mouse and keyboard coloring, undo/reset, page persistence, comparison mode, wishlist, search and product navigation. It does not replace rendered browser or mobile QA.

## Source map

- `index.html`: document and accessible dialog shells.
- `src/app.js`: routes, view components, interactions, coloring state.
- `src/art.js`: original SVG demo illustrations and independently paintable regions.
- `src/data.js`: editable product catalog and palettes.
- `src/styles.css`: full design system, responsive layouts and animation.
- `scripts/serve.mjs`: local static server.
- `scripts/build.mjs`: portable static build.
- `docs/DESIGN.md`: design rationale and production checklist.

## Connect the real catalog

The four editions, artwork, page counts, sizes, and age ranges are **demo content**, not verified product listings. No customer testimonials, ratings, stock levels or prices are fabricated.

1. Edit the records in `src/data.js` with final titles, specifications, descriptions and prices.
2. Set each `amazonUrl` to its verified HTTPS product URL. The purchase button appears only when a URL is supplied.
3. Replace demo covers via the `cover()` component in `src/app.js`; put licensed cover images under `assets/` and add image paths to your records.
4. Replace sample art in `src/art.js`. Keep each fillable area a closed SVG path with a stable, unique region ID and a default color. Keep black outlines above color fills. Do not inject untrusted SVG markup.
5. Use actual book interiors for all preview pages. Some demo motifs are reused across editions to demonstrate navigation.

Purchases currently remain unavailable until real URLs are supplied. There is no cart or payment gateway because this catalog is designed to hand off to Amazon. The free-download flow works without collecting emails. An email/newsletter service, verified social profiles, customer reviews, and legal contact information must be supplied before adding those integrations. No hidden network submission or fake success state is implemented.

## Storage and privacy

Wishlist and artwork use this device's `localStorage`. Downloads are generated locally. Clearing browser data removes saved work. No analytics, accounts, or backend are included. Google Fonts is an optional external font request; system fallbacks are provided. Self-host the fonts if you need an entirely offline deployment.

## Design references

- https://www.aardvarkbookclub.com/ — homepage composition, scale and playful book presentation.
- https://wherecolorsdream.art/index.html — quiet coloring workspace and region-based painting.

All demo vector artwork and copy were authored for this project. No source code, branded assets, product covers or illustrations from the reference sites are included. This is an interpretation for Homepilato, not a pixel-identical reproduction.
