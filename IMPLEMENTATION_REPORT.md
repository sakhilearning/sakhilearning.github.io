# Sakhi Learning Trails V3 — implementation report

Release candidate: `2026.09.10-v3`
Baseline production commit: `bb388ed14f721c25c3fb2140481e2913e8ed9bc8`

## What changed

V3 keeps the production V2 architecture principles but changes the child
experience from a cosmetic mood/world picker to **fixed subject learning trails**.
Curriculum and adaptation select learning first; trail presentation is applied
only after the skill and band are known.

### Fixed subject trails

| domain | trail | presentation world |
|---|---|---|
| Reading & Phonics | Rainbow Reading Trail | unicorn meadow |
| Math | Crystal Number Palace | ice palace |
| Writing | Butterfly Letter Studio | tower/butterfly studio |
| Stories & Language | Enchanted Story Library | forest library |
| Logic | Royal Puzzle Ballroom | royal ballroom |
| Science | Mermaid Discovery Lagoon | mermaid lagoon |

Each trail has five landmarks so progress feels spatial and persistent rather
than like a random theme change.

## Curriculum

Active curriculum version is `2026.09.10-v3`.

- 85 skills across six Kindergarten domains
- all 48 V2 production skill IDs retained for migration
- 72 prerequisite edges
- five support/difficulty bands per skill
- 26 weeks, five planned days per week, 130 days total
- 3,900 planned minutes / 65 hours
- each canonical day: four 6-minute app blocks plus a 6-minute off-screen mission
- reading and math appear every planned day
- movement, handwriting/pencil work and family conversation appear every day

The V3 graph adds missing Kindergarten foundations such as print concepts,
alphabet names, rhyme, syllables, oral blending/segmenting, high-frequency words,
counting/numerals to 20, subitizing, comparison, data, 3D shape concepts,
conversation/question skills, memory/flexibility, science foundations, name
writing, lowercase formation, numeral writing, and simple composition.

## Content and activities

The content bank was expanded so the larger graph is not merely new labels over
the same tiny question set. Activity generation remains deterministic for
replay/reload safety and continues to use the shared renderer system rather than
hundreds of one-off lesson files.

Automated activity coverage currently exercises:

`85 skills × 5 bands × 20 seeds = 8,500 generated activities`

## Architecture corrections

- `SakhiAdaptive` is read-only; placement credit is committed by
  `SakhiProgress.completeActivity()`.
- `SakhiPlan` owns six-month cadence and 25/30/35-minute session block policy.
- `SakhiTrails` owns stable subject-to-world mapping.
- `SakhiPresentation` themes semantic visuals after learning selection.
- `SakhiCloud` retains non-transient failed writes in a dead-letter queue rather
  than silently dropping them.
- parent gate no longer contains a static passcode in client source; it is a
  short-lived adult-deterrent gate only, while Supabase Auth/RLS protects data.
- parent metrics keep correctness and independence separate.
- CSS uses explicit cascade layers and the deploy gate rejects `!important` and
  conflicting ownership in the same layer/media context.

## Audio

Narration uses the existing Supabase `sakhi-tts` function to ElevenLabs. Pure
phonemes follow a separate structured path so `/m/` is not handed to generic
browser TTS. Local validated recordings are preferred. The dedicated server
phoneme route is the only allowed fallback for a missing local sound.

Bundled local phonemes remain `/t/` and `/p/`; all other instructional phonemes
should be listened to/validated before being marked locally verified.

## Cloud / weekly parent email

`migrations/20260910_v3_foundation.sql` adds V3 plan/settings/report metadata and
a versioned curriculum bundle without dropping learner records. The weekly
report Edge Function is in `supabase/functions/weekly-report/index.ts` and is
triggered by `.github/workflows/weekly-parent-report.yml` when configured.

Secrets are never stored in browser source. Required server-side secrets are
documented in the release guide.

## QA result

The release candidate passes `npm run qa`, including:

- JavaScript syntax checks
- graph/prerequisite validation
- all skill/band activity generation
- deterministic activity tests
- placement/adaptive/mastery/reward regressions
- fixed-trail presentation isolation
- six-month plan validation
- 25/30/35-minute cadence validation
- cloud/dead-letter/idempotency guards
- local asset/PWA checks
- CSS ownership checks

## Remaining deployment tasks

1. Apply the V3 Supabase migration in a controlled environment.
2. Deploy/configure the weekly-report Edge Function only if weekly email is desired.
3. Run the manual primary-device smoke checklist before merging to `main`.
4. Continue replacing instructional emoji with controlled SVG/image objects where
   exact visual properties matter.
5. Validate the remaining isolated phoneme inventory.
