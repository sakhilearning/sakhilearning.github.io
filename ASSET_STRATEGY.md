# Sakhi V3 character and image asset strategy

The visual system supports a rich magical learning experience while keeping
instructional meaning and curriculum independent from character art.

## Current V3 asset owners

- `sakhi-art.js` is the central registry for world scenes, portraits and reward imagery.
- `sakhi-presentation.js` maps semantic activity roles to the current fixed subject trail.
- `sakhi-templates.js` renders the already-resolved activity visuals.

UI/activity code must not scatter arbitrary image URLs or perform its own web
searches. The running app has no permanent third-party image hotlinks.

## Existing inventory

The current high-resolution scene set is **KEEP** for V3 and can be upgraded
incrementally without changing pedagogy:

- `rainbow-meadow.webp` — Reading & Phonics
- `frozen-palace.webp` — Math
- `tower-art-studio.webp` — Writing
- `forest-library.webp` — Stories & Language
- `royal-ballroom.webp` — Logic/Puzzles
- `mermaid-lagoon.webp` — Science/Discovery
- `story-castle.webp` — rewards/celebration
- original unicorn icons/art — brand/offline fallback

Controlled instructional SVGs belong under `assets/educational/`; photographs or
rendered learning references belong under `assets/learning/`.

## Familiar-character support

The child enjoys Disney princesses and other familiar worlds. The architecture
may support a rights-cleared/private character pack, but the public GitHub Pages
repository must not contain unlicensed Disney/franchise artwork, logos, music,
or copied character designs.

Useful associations when lawful assets are available include Belle for stories,
Ariel for ocean discovery, Elsa/Anna for crystal-number challenges, Rapunzel for
art/writing, Cinderella for routines/sorting, and unicorns for phonics/rewards.
These associations are presentation only. They never become curriculum rules.

## Asset record

Every non-generated registered asset should be able to retain:

- stable `asset_id`
- character/world/category
- local path
- dimensions/aspect ratio
- use case
- quality status: KEEP / UPGRADE / REPLACE / BROKEN
- source/provenance
- rights note
- fallback asset id

## Quality requirements

Prefer high resolution, clear focal subject, clean crop, minimal embedded text,
no watermarks, child-safe expressions, and strong separation between scenery
and instructional objects. Reject distorted, pixelated, browser-screenshot, or
uncertain-rights assets.

Instructional geometry, letter formation, number manipulatives, and science
objects should use controlled SVG/image assets rather than relying on platform-
dependent emoji when exact visual properties matter.

## Failure and preload

Every important image needs a local fallback. The child should never see a
broken-image icon, raw URL, gray technical error box, or rights/provenance text.
World scenes can be prefetched before their activity. The service worker caches
all core scene assets and the educational objects referenced by the runtime.
