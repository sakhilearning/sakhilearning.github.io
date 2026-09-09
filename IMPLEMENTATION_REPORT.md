# Sakhi stabilization — implementation report

Branch `stabilization/princess-theme-core`, based on `ef34778`
(= `main` `b253d22` + verified UX fixes). `main` untouched. Not yet pushed.

```
cce44e8  Phase 20: production cleanup, new deploy gate, placement persistence fix
02f5e62  Phases 8, 12-16: audio stabilization, child UI, parent view, path maps
11cdec0  Phases 5, 6, 10, 11: content engine, adaptive placement, reward ledger, atomic completion
62969ba  Phase 1-3 spine: audit, cloud layer, curriculum graph, theme registry
ef34778  Fix Phase 1 UX bugs in the production runtime
```

88 files changed, +6,154 / −2,775 against `main`.

## 1. Structural audit (reconfirmed)

The single most important finding: **the backend was already complete and
orphaned**. `b253d22` replaced the client that consumed Supabase with a
localStorage-only runtime; the database it talked to was still fully provisioned
and seeded. The work was reconnection, not construction.

**Phase 4 was already satisfied and was therefore verified, not rebuilt.** The
live graph at `curriculum_version 2026.09.08-v2` passes every criterion in the
brief: no duplicate skill ids, no unresolved prerequisites, no prerequisite or
`recommended_next` loops, no orphans, an entry point in every domain, every
skill active.

## 2. Migration ledger

| migration | status |
|---|---|
| `supabase-schema.sql` | applied (pre-existing) — learner_profiles, learner_skill_progress, learning_sessions, learning_attempts, review_schedule, RLS |
| `20260909_adaptive_acceleration_state.sql` | applied (pre-existing) — adaptive_state, domain_levels, learning_velocity, per-attempt adaptive columns |
| `20260909_theme_configuration.sql` | **NOT APPLIED — action required** |

The pending migration adds `active_theme` + a database-level CHECK constraint so
a bad client cannot park a curriculum decision in the theme slot, the
`reward_transactions` ledger with a partial unique index enforcing
idempotency, a derived `reward_balances` view, and table `GRANT`s for the
`authenticated` role. It is additive and safe to re-run.

Note on the grants: `anon` provably has no grant on the learner tables (probes
return Postgres `42501`, not an auth error). The `authenticated` role could not
be tested without a signed-in session, so the grants are included defensively —
harmless if already present, but if they are missing, cloud sync would fail for
a signed-in parent too.

## 3. Curriculum and content coverage

| domain | skills | curriculum levels | activities (× 5 bands) |
|---|---|---|---|
| Reading & Phonics | 11 | 1–5 | 55 |
| Math Thinking | 10 | 1–4 | 50 |
| Stories & Language | 8 | 1–4 | 40 |
| Puzzle Power (logic) | 6 | 1–3 | 30 |
| Discovery Lab (science) | 8 | 1–3 | 40 |
| Create & Write | 5 | 1–4 | 25 |
| **total** | **48** | | **240** |

Seven renderers cover all of it: choice (37 skills), sequence (9), build (8),
count (5), sort (4), match (1), trace (1).

## 4. Theme coverage

Six worlds, cosmetic only. Where the brief named a film franchise, the
equivalent original world is used, so the published app carries no third-party
character IP; the reward currency names from the brief are kept, since those are
descriptive nouns.

| world | companion | rewards |
|---|---|---|
| Unicorn Meadow | Sakhi the Unicorn | Magic Stars · Unicorn Gems |
| Royal Castle Ball | Princess Amara | Magic Stars · Royal Badges |
| Ice Crystal Palace | Frost Princess Neve | Snow Crystals · Ice Trophies |
| Mermaid Lagoon | Coral the Mermaid | Lagoon Pearls · Shell Badges |
| Wayfinder Cove | Wayfinder Tala | Courage Hearts · Wayfinder Gems |
| Butterfly Cottage | Lantern Fairy Mira | Miracle Candles · Butterfly Badges |

Separation is enforced three ways: a theme declaring any curriculum-shaped key
fails to register; themes are deep-frozen; `sakhi-adaptive.js` never imports
`SakhiThemes`; and the deploy gate greps for violations of the last two.

## 5. Phoneme audit — INCOMPLETE, blocked

| | |
|---|---|
| required | 24 |
| present | 2 — `/t/`, `/p/` |
| missing | `m s n k b d g f l r h a e i o u sh ch th wh ck ng` |

`playPhoneme()` **refuses to fall back to speech synthesis** for a missing
isolated sound, because a TTS engine says "tuh" for /t/ and would actively teach
the wrong thing. The parent view surfaces the count. Recording these is a human
task; it cannot be closed in software.

## 6. Test log

```
npm run test:unit
  tests/activities.test.cjs   720 activities (48 skills × 5 bands × 3 seeds)
                              all structurally valid, deterministic, seed-sensitive
  tests/engine.test.cjs       placement · reload persistence · acceleration ·
                              session length · reward idempotency · theme isolation ·
                              evidence-based mastery · status block    ALL PASSED

node scripts/validate-production-app.cjs                              PASSED
```

The gate was confirmed to **fail** on each of: a theme reaching into curriculum,
adaptive reading the theme, a resurrected `app.js`, an injected prerequisite
loop, and a skill losing its content bank.

Browser acceptance, run against the live Supabase project: curriculum loads with
`source: "supabase"` over CORS; a fresh learner passes the placement probe on
`reading.cvc_mixed`; letter sounds, short vowels and blend & segment show ✓ on
the path map without ever being taught; the session advances
`cvc_mixed → cvc_encode → digraphs → blends → sentences` in one sitting at band
2; rewards are named by the active world; and after a page reload the credits,
balances, attempts and theme are all intact.

## 7. Storage architecture checklist

| requirement | status |
|---|---|
| Supabase is the authority | yes |
| localStorage is cache + outbox only | yes — never reported as the permanent record |
| honest connection status | yes — 4-valued, only `CONNECTED` after an authenticated request succeeds |
| no misleading sync messaging when offline | yes |
| offline writes replay idempotently | yes — client-generated ids + merge-duplicates upsert |
| one atomic completion path | yes — `SakhiProgress.completeActivity()` |
| rewards derived, never a settable counter | yes — balances sum the ledger |
| cross-device restore | **blocked** — needs the pending migration and a signed-in parent |

## 8. Outstanding

1. **Run `migrations/20260909_theme_configuration.sql`.** Until then the cloud
   half is untested against a real ledger.
2. **Create the sandbox test user** (Phase 17/18). Account creation and password
   handling were out of scope for this work.
3. **Record the 22 missing phonemes** (Phase 7).
4. **Push and deploy.** No git credentials on this machine.

Phases 17–19 are therefore complete for everything that runs locally, and open
for everything that requires an authenticated Supabase session.
