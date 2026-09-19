# Motion audit and implementation map

Reference inspected: https://www.aardvarkbookclub.com/

The live page was inspected across the hero, catalog hover, four-card journey, pinned unboxing sequence and category section. Its public resource declarations were inspected to distinguish image sequences from DOM/SVG animations. Source-site JavaScript, fonts, logos and commercial cover images are not redistributed in this repository.

| Surface | Observed reference behavior | This implementation |
| --- | --- | --- |
| Hero | A 120-frame, 24-fps canvas loop; oversized title and wavy background | Five-second looping 3D CSS books, staggered heading, cursor and scroll parallax; all covers replaceable |
| Navigation | Capsule links remain fixed as the page scrolls | Centered fixed capsules; edge branding/actions retreat on desktop scroll |
| Buttons | Letter squash/rebound and separately moving arrow block | Per-letter GSAP squash/spring, independently rotating arrow block |
| Book catalog | Horizontal dragging, rotated colored cards, hover extensions and popping decorative shapes | Native horizontal rail plus mouse dragging, keyboard/swipe controls, rotational response, spring CTA and sprouts |
| Journey cards | Four overlapping bright cards, rotation and spring movement | Four responsive fan cards with scroll-linked spread and desktop hover lift |
| Box | Pinned raster sequence driven by scroll; lid opens, contents appear, copy changes | Sticky CSS 3D parcel, scrubbed lid opening and cover emergence, staged copy/final CTA |
| Genres | Large rollover text; multiple covers appear around pointer | Rolling title lines, four cover holders with spring scale and pointer parallax |
| Section content | Staggered entrances and handwritten text reveals | Word entrances, clipped note reveal, section/card reveals |

## What is deliberately different

The reference Hero and box are pre-rendered images. Individual cover images cannot simply be changed inside those baked frames. This version recreates their role and motion in CSS/GSAP so `coverImage` can be replaced in one place. It is not a frame-for-frame copy. The display font is open-license Archivo Black, not the reference's commercial Champ font. Original Homepilato art replaces the reference branding and illustrations.

## Files and tuning

- `src/home.js`: scene objects and section markup.
- `src/motion.js`: animation setup, timings, carousel behavior, route cleanup.
- `src/motion.css`: 3D planes, layout, hover styles, mobile and static fallback.
- `src/data.js`: shared `coverImage` asset references.
- `scripts/prepare-assets.mjs`: refresh local libraries/fonts from installed npm packages (`npm run assets`).

The hero loop is 5 seconds. The smooth wheel duration is 1.05 seconds. Unboxing uses a 300-viewport-height desktop section and 280 on mobile, with a scrub smoothing value of 0.65. Change `motionSettings` and the corresponding CSS section heights to tune these values.

## Accessibility and lifecycle

- Mouse wheel smoothing does not intercept touch scrolling or nested dialog/carousel scrolling.
- Modal opening stops Lenis; closing restarts it.
- Reduced-motion users receive a static open-box layout rather than a long pinned sequence.
- The layout remains usable if motion scripts cannot load.
- Route changes remove event listeners, scroll triggers, tickers and tweens.
- Dragging a card suppresses the following click so the preview does not open accidentally.
- Carousel arrows and keyboard navigation remain available alongside drag/swipe.

## Validation boundary

Automated tests use Happy DOM plus real GSAP/ScrollTrigger scripts to check mounting, teardown and interaction regressions. They do not verify pixels, visual timing or touch rendering. Localhost was blocked by the available browser, so rendered desktop/mobile comparison is still needed on a local or hosted browser.
