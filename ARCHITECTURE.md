# Sakhi Learning Trails V3 architecture

This file is the authoritative runtime map for the GitHub Pages app. The design
rule is **one owner per concern**. Do not add wrapper services, override layers,
or a second implementation whose behavior depends on load order.

| module | owns | must not own |
|---|---|---|
| `supabase-config.js` | public Supabase URL, publishable key, public function URLs | secrets |
| `sakhi-cloud.js` | auth session, Supabase transport, connection truth, offline outbox, dead-letter queue | curriculum, pedagogy |
| `sakhi-curriculum.js` | V3 skill graph, prerequisites, availability, frontier, next-after | themes, UI, storage |
| `sakhi-content.js` | human-reviewable content banks per skill | mastery, themes, storage |
| `sakhi-activities.js` | deterministic activity generation from `(skill, band, seed)` | themes, persistence |
| `sakhi-plan.js` | 26-week cadence, daily block selection, session-length block count | mastery, presentation |
| `sakhi-trails.js` | stable subject-to-world map and trail landmarks | skill selection, difficulty |
| `sakhi-presentation.js` | semantic activity visuals and trail story framing | curriculum/adaptive decisions |
| `sakhi-themes.js` | palette, narration flavor, companions, reward names | curriculum-shaped keys |
| `sakhi-art.js` | local scene/portrait/reward asset registry and fallback paths | pedagogy |
| `sakhi-progress.js` | learner evidence, mastery, review, rewards, placement credit, plan state | UI |
| `sakhi-adaptive.js` | read-only placement recommendations, review, acceleration, target substitution | presentation, writes |
| `sakhi-audio.js` | ElevenLabs narration gateway, structured phoneme playback, cache, audio faults | pedagogy |
| `sakhi-templates.js` | touch-first interaction renderers | curriculum, persistence |
| `sakhi-app.js` | routing, views, session wiring, parent UI | independent pedagogy |

## Non-negotiable invariants

### 1. Curriculum first, presentation second

A subject trail is **stable and meaningful**, not a mood picker. Reading always
uses the Rainbow Reading Trail, math the Crystal Number Palace, writing the
Butterfly Letter Studio, language the Enchanted Story Library, logic the Royal
Puzzle Ballroom, and science the Mermaid Discovery Lagoon.

The curriculum/adaptive layers choose the skill and difficulty first. Only then
may presentation convert semantic roles into crystals, shells, butterflies,
books, stars, scenery, companion copy, or reward names. Changing a trail must
never change the answer, prerequisite order, difficulty, mastery, or next skill.

### 2. One learning write path

`SakhiProgress.completeActivity()` is the only function that records learning
evidence. Placement credit is committed there as part of the same completion.
`sakhi-adaptive.js` is read-only.

Profile settings and session lifecycle may persist outside `completeActivity()`,
but they must never mutate skill evidence or mastery.

### 3. Supabase is durable authority after authentication

Browser storage is the fast local cache and offline bridge. Cloud writes are
idempotent upserts. A failed non-transient write moves to a dead-letter queue;
it is never silently dropped. `CONNECTED` is shown only after an authenticated
learner-data request succeeds.

### 4. Cadence has one owner

`sakhi-plan.js` owns the six-month schedule and parent session-length policy.
The canonical day is 24 minutes of app mini-quests plus a 6-minute off-screen
mission. A 25-minute preference uses three app blocks, 30 uses four, and 35 adds
one confirmation block. The app shell does not invent another duration policy.

### 5. CSS does not depend on "last rule wins"

`sakhi-production.css` declares the fixed cascade order:

```css
@layer reset, tokens, base, layout, components, scenes, states, utilities;
```

The deploy validator rejects `!important` and conflicting property ownership in
the same layer/media context. Theme variation should flow through tokens and
presentation state rather than duplicate component rules.

## Curriculum

Active version: `2026.09.10-v3`.

The bundled graph contains **85 skills in six Kindergarten domains** and keeps
all 48 production V2 skill IDs for progress migration. `curriculum-snapshot.json`
is the offline mirror. `migrations/20260910_v3_foundation.sql` publishes the V3
bundle to Supabase without dropping existing learner data.

Five difficulty bands remain a practice support dimension; they are not five
copies of the curriculum. Mastery and review thresholds come from each skill's
`mastery_criteria` and `review_policy`.

## Audio

Narration uses the existing Supabase `sakhi-tts` gateway to ElevenLabs. Isolated
phonemes use validated local recordings when available; the only permitted
fallback is the dedicated server phoneme route. Browser speech synthesis is
never used for an isolated phoneme.

## Validation

Run the single release gate:

```bash
npm ci
npm run qa
```

`qa` checks JavaScript syntax, curriculum graph integrity, every skill at all
five bands, adaptive/write separation, theme invariance, cloud integrity,
26-week cadence, session-length behavior, CSS ownership, local assets, PWA
wiring, and engine regressions.
