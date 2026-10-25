# Sakhi Learning Trails 4.12.0

An offline-first family learning app built on the existing 4.10.0 Sakhi repository. Its original nine illustrated subject trails, learner evidence, account sync, rewards, and bundled Kokoro voice remain in place.

## Play scenes (4.12.0)

Early math uses a dedicated scene player instead of a worksheet decorated with repeated pictures. The player shows **one character, one group, and one numeric answer rail**. A missing-number question such as 7, ?, 9 has a single group of eight footballs; its answer bar contains the numbers 1–10 without pictures. The cartoon friend can kick the balls in one at a time. Addition grows one group, and subtraction visibly removes objects from that group. Replay, tap counting, numeric input, animation cancellation, and scoring have distinct responsibilities.

- `sakhi-scene-plan.js`: pure teaching contract derived from the question, with a bounded object count and number range.
- `sakhi-play-scenes.js`: scene lifecycle, character action, one object field, replay, and numeric answer input.
- `sakhi-play-scenes.css`: the player layout; the former repeated picture-card grid was removed.
- `sakhi-audio.js`: persistent narration, character rate/pitch effects, original quiet music and action sounds. Parents can choose a clear guide, dinosaur, pixie or playful effect, and disable music or adjust its volume. These are effects on the bundled recording, not separately recorded voice actors.

Saved questions gain the new scene without changing their answer or progress evidence. Counting quantities up to 20 use one organized group; larger numbers use compact place-value models. The existing curriculum, progress and account modules remain the data services, while the new player owns these early-math interactions.

26 local sticker assets cover dinosaurs, horses, unicorns, princesses, chairs, toys, wands, rings, mice, cats, fish, balls, hats, food, paper clips, and more. Artwork by [OpenMoji](https://openmoji.org/), licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), is redistributed unmodified with source URLs, hashes, and the license in `assets/theme-media/math-stickers/`.

Run `npm run test:math-visuals` for quantities, input, animation lifecycle, saved-question upgrades, and asset integrity. Use `python3 scripts/fetch-math-stickers.py` only when intentionally refreshing the vendored artwork.

## Curriculum release (4.11.0)

- 410 canonical skills: the original 141 skills plus 269 imported math skills. All 295 recovered curriculum rows are retained with their original titles, source turn IDs, inferred grades, and canonical mappings. Duplicates share a skill and evidence rather than creating separate progress records.
- Kindergarten through Grade 6 selection in the parent dashboard. Children see eligible skills and adaptive next activities. Future-grade lessons stay in the parent catalog. Choosing an older grade permits placement on earlier-grade prerequisites without fabricating mastery.
- A rolling 365-day plan, with 30-minute daily allocations by default, daily math, science, language, reading, writing, and rotating enrichment. Plans continue beyond the first year. The curated original 130-day schedule remains a Kindergarten seed.
- Seeded activity generators with varied numbers and story contexts, objects, arrays, fraction diagrams, clocks, coin values, shapes, angles, dimensions, explanations, hints, and supported retries. Existing spaced review and mastery evidence continue to control progression.
- Full parent curriculum dropdown, searchable grade-filtered evidence table, overall/recent accuracy, prerequisites, review dates, curriculum/progress export, printable practice with answer keys, and animated worked mini lessons.
- A device-local parent PIN gate (PBKDF2 salted hash, five-minute unlock, retry cooldown). A persistent daily active-learning limit defaults to 30 minutes; only an unlocked parent can add time. Visible activity time counts; hidden tabs and home/parent screens do not. The PIN is not stored in progress exports or sent to account sync.
- Audio remains a persistent singleton. Desktop prefetch now decodes clips before playback, and PWA updates preserve the persistent voice cache.

## Run and validate

```bash
npm ci
npm run release
npm run preview
```

Open http://localhost:4173. The build uses `package.json` as its version source and generates the root `index.html`, manifest, service worker, and `dist/`. The repository's GitHub Pages workflow deploys `dist/` when a change is pushed to `main`.

```bash
npm run test:grade-curriculum
node scripts/import-supplied-curriculum.cjs
```

The import is reproducible. Review [the source-to-skill mapping](docs/curriculum-coverage.json) and [implementation notes](docs/CURRICULUM_UPGRADE.md) before changing the catalog. Existing skill IDs and saved evidence are preserved.

## Coverage and current limits

The earlier conversation supplied the pasted lesson titles, which are captured in `data/supplied-curriculum.json`. The original uploaded files and five screenshots were not available in this workspace or through conversation retrieval. Grade assignments are inferred from the pasted sequence and need parent/educator review. This release extends the supplied mathematics through Grade 6; the other eight trails retain the existing early-learning content. It does not claim a complete Grade 1–6 reading, writing, or science syllabus.

Original lesson narration continues to use the bundled `af_heart` pack. New parameterized math uses an immediate bundled cue and on-screen teaching, prompts, and hints. **Its changing question text is not fully narrated.** Recording/compositional narration coverage for the new generators is still required, particularly for nonreaders. A successful narration coverage test confirms the reachable spoken segments, not that every on-screen sentence is spoken.

Mini lessons are animated in-app worked steps, not prerecorded videos. The parent video button opens a related Khan Academy YouTube search; results are not curated or embedded. Generators are reusable and the planner has no terminal day, but small concept banks can recur. Some imported topics share a representative generator rather than a complete sequence of school lessons. Automated checks verify structure, answer validity, mathematical cases, grade isolation, and regressions; they do not establish pedagogical completeness or guarantee mastery. Writing remains guided practice requiring adult review.

The PIN is a child deterrent on a family device, not server-side authorization. Account sync still uses the existing Supabase configuration and migrations. Time budgets reside in the learner settings; concurrent devices do not provide a tamper-proof shared timer. Existing accounts were not used during validation.
