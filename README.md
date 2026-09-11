# Sakhi Learning Trails V3

Sakhi is a touch-first, mastery-based Kindergarten learning PWA built for a
short daily routine at home. V3 turns the old mood-style worlds into **fixed,
meaningful subject trails** while keeping curriculum and presentation strictly
separate.

## Six-month learning program

- 26 weeks
- 5 planned practice days per week
- 130 planned days total
- about 30 minutes per canonical day
- 24 minutes of app mini-quests + 6 minutes of movement/pencil/family talk
- 85 skills across Reading & Phonics, Math, Writing, Stories & Language, Logic,
  and Science
- readiness-based placement, adaptive prerequisite substitution, spaced review,
  and repeated independent evidence before mastery

The stable subject worlds are:

- Rainbow Reading Trail — phonological awareness, phonics, decoding, connected text
- Crystal Number Palace — counting, number sense, operations, geometry, measurement
- Butterfly Letter Studio — pre-writing, handwriting, spelling, sentences, composition
- Enchanted Story Library — listening, vocabulary, oral language, comprehension
- Royal Puzzle Ballroom — memory, classification, patterns, reasoning, early coding
- Mermaid Discovery Lagoon — observation, living things, materials, weather, space

The world makes an activity memorable; it never chooses what the child learns.

## Local development

Requires Node.js 20+.

```bash
npm ci
npm run qa
npm run preview
```

Then open `http://127.0.0.1:8080`.

This project intentionally has no third-party npm runtime dependencies. The
browser app is static HTML/CSS/JavaScript and GitHub Pages serves it directly.

## Release QA

`npm run qa` is the release gate. It validates:

- syntax for all runtime JavaScript;
- 85-skill prerequisite graph and V2 ID compatibility;
- generation for every skill at all five bands;
- deterministic/replay-safe activity behavior;
- one learning write path and read-only adaptive planning;
- fixed trail/theme separation from pedagogy;
- 26 weeks / 130 days / daily minute totals;
- 25/30/35-minute session-length behavior;
- cloud outbox/dead-letter/idempotency guards;
- parent gate regression checks;
- CSS cascade-layer ownership and absence of `!important`;
- local image/audio references and PWA/service-worker wiring.

## Supabase and ElevenLabs

`supabase-config.js` contains only public browser configuration. Never place a
service-role key, ElevenLabs API key, Resend key, or other secret in the repo.

Narration follows:

`browser -> Supabase sakhi-tts Edge Function -> ElevenLabs`

Pure instructional phonemes use validated local recordings first. A dedicated
server phoneme request may be used for missing sounds, but each instructional
phoneme should be listened to and approved before it is treated as validated.

For V3 cloud metadata and weekly email support, apply:

1. `migrations/20260909_theme_configuration.sql` if it has not already been applied
2. `migrations/20260910_v3_foundation.sql`

The weekly email function lives at `supabase/functions/weekly-report/index.ts`.
Its secrets stay in Supabase. The GitHub workflow only stores the protected
function URL and cron secret.

## Asset policy

The public GitHub Pages repository ships original/generic magical worlds and
controlled educational assets. Do not commit unlicensed Disney/franchise art,
music, or logos. Rights-cleared or user-owned familiar-character packs can be
added later through the centralized art/presentation layer without changing the
curriculum.

## Hosting

Production: https://sakhilearning.github.io/

GitHub Pages deployment is defined in `.github/workflows/pages.yml` and runs the
full V3 QA gate before publishing.
