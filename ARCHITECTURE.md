# Sakhi architecture

One owner per concern. Every file below is loaded by `index.html`; nothing else
at the repo root is part of the running app.

| module | owns | must not touch |
|---|---|---|
| `supabase-config.js` | public project URL + publishable key | — |
| `sakhi-cloud.js` | Supabase transport, auth session, connection status, offline outbox | curriculum, pedagogy |
| `sakhi-curriculum.js` | the skill graph: domains, strands, skills, prerequisites, frontier, next-after | themes, storage |
| `sakhi-themes.js` | worlds: palette, companion, narration copy, reward *names* | anything curricular |
| `sakhi-content.js` | item banks per skill (data only) | logic, themes |
| `sakhi-activities.js` | turning (skill, band, seed) into an activity | themes, storage |
| `sakhi-progress.js` | evidence, mastery, spaced review, reward ledger, **the one completion path** | UI |
| `sakhi-adaptive.js` | placement, acceleration, what to teach next | themes |
| `sakhi-audio.js` | audio unlock, narration, phoneme bank, typed faults | pedagogy |
| `sakhi-templates.js` | the seven interaction renderers | pedagogy, storage |
| `sakhi-app.js` | views, routing, wiring | pedagogy (delegates) |

## The two invariants

**1. Themes are cosmetic.** A theme may change colours, the companion, narration
wording and what a reward is *called*. It may never change which skill is
taught, in what order, or at what difficulty.

Enforced three ways: `sakhi-themes.js` rejects any theme declaring a
curriculum-shaped key and deep-freezes the rest; `sakhi-adaptive.js` never
imports `SakhiThemes`; and the deploy gate greps for both violations.

**2. One write path.** `SakhiProgress.completeActivity()` is the only function
that records learning. It stages attempts, evidence, mastery, review schedule,
rewards and session state, commits locally, then queues exactly one cloud batch.
Nothing else writes.

## Storage

Supabase is the authority. `localStorage` is a read cache and an outbox, never
the permanent record. Connection status is four-valued — `NOT_CONFIGURED`,
`OFFLINE`, `NOT_CONNECTED`, `CONNECTED` — and only reaches `CONNECTED` after an
authenticated request actually succeeds, so the parent view can never show a
sync that did not happen. Queued writes carry client-generated ids and use
merge-duplicates upsert, so replaying the outbox converges instead of
duplicating.

## Curriculum

The graph lives in Supabase (`curriculum_*` tables, anon-readable reference
data) at version `2026.09.08-v2`. `curriculum-snapshot.json` mirrors it so the
app works offline and the graph is diffable in git. Mastery thresholds and
review intervals come from each skill's own `mastery_criteria` and
`review_policy` — pedagogy lives with the curriculum, not in the client.

## Difficulty

Five bands are applied on top of every template rather than duplicated per
skill: 1 INTRO (2 choices, worked model), 2 SUPPORTED (3 choices, partial
scaffold), 3 INDEPENDENT, 4 MIXED (4 choices, drawn across the bank),
5 CHALLENGE (near-miss distractors). 48 skills x 5 bands = 240 distinct
activities from 7 renderers.

## Tests

```bash
npm run test:unit     # activities coverage + engine simulation
node scripts/validate-production-app.cjs   # the deploy gate
```

The gate is regression-tested: it fails on a theme reaching into curriculum, on
adaptive reading the theme, on a resurrected legacy file, on a prerequisite
loop, and on a skill losing its content bank.
