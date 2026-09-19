# Design and implementation notes

## Visual direction

The reference homepage uses saturated yellow, huge black type, physical books in motion, an open composition and capsule navigation. Homepilato adopts these structural choices, with warm pink, lilac and green books and original chibi artwork. The experience continues through a draggable catalog, four fanned journey cards, a scroll-linked unboxing stage, interactive genre list, benefits, a studio gallery, free printables and FAQs.

The coloring room changes pace: paper tones, quieter typography, a two-page book, soft shadows, compact controls. On small phones, the decorative facing page disappears to preserve a usable drawing area. The modal uses native dialog focus trapping and Escape behavior.

## Coloring engine

Every illustration is a set of closed SVG regions. Each region owns an ID, geometry and suggested color. Clicking changes only that region; outlines stay visible. The automatic demo fills regions one after another with fill transitions. The before/after slider clips a colored set over the line-art set. Artwork is persisted by book ID and page index, so editions do not overwrite each other. Timers are canceled on manual painting, page changes and closing the dialog.

The app exports SVG rather than a screenshot, preserving line quality for print. Sample pages are original demonstrative art. The homepage covers use those same motifs so visitors can connect each cover to its interior style.

## Production handoff

- Replace all demo metadata and illustrations with approved product assets.
- Add verified Amazon links; ensure displayed prices match the target marketplace.
- Add actual reviews only when permission and source are available.
- Connect a newsletter backend only if email collection is required; then update privacy copy.
- Add verified social/profile and support links instead of placeholder destinations.
- Hash routes are static-host friendly. Use prerendered path routes and route-specific product schema for a larger SEO-focused commercial catalog.
- The current site is a storefront frontend; it does not accept payments or orders itself.

## Verification

Build, syntax validation, and automated DOM integration checks are run before delivery. The environment's browser blocks localhost navigation, so local rendered browser QA cannot be completed through that browser. Check the deployed site on desktop and a touch device before commercial launch, including color persistence, keyboard focus, SVG downloads and actual Amazon destinations.

## Motion revision

The reference audit and implemented motion mapping are documented in `MOTION.md`. Cover replacement instructions are in `THAY-ANH-BIA.md`. Runtime libraries and the Archivo Black font are bundled locally. The original animated raster sequences and commercial reference fonts are not copied.
