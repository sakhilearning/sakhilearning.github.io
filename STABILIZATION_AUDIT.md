> **Historical V2 record.** This file describes the 2026-09-09 stabilization baseline. Current V3 architecture is defined by `ARCHITECTURE.md`.

# Phase 1 — Safe Checkpoint & Audit

Recorded 2026-09-09 on branch `stabilization/princess-theme-core`.

## Branch point

Branched from `phase1-stabilization` (`ef34778`), which is `main` (`b253d22`,
"Stabilize Sakhi as one production app") plus a set of verified UX bug fixes.
Branching from bare `main` was rejected because it would discard those fixes.
`main` is untouched.

## Headline finding

**The backend is complete and orphaned.** The `b253d22` stabilization commit
replaced the client that consumed Supabase with a localStorage-only runtime
(`sakhi-production.js`). The database it was talking to is still fully
provisioned and seeded. Nothing needs to be built there; it needs reconnecting.

This means Phase 4 ("seed the real curriculum graph") is **already satisfied** —
see the validation below. The real work is Phases 2/3/11: reconnect.

## Current commit

| | |
|---|---|
| main | `b253d22` Stabilize Sakhi as one production app |
| branch base | `ef34778` Fix Phase 1 UX bugs in the production runtime |
| working branch | `stabilization/princess-theme-core` |

## Supabase project

`https://okzmrlrijovbuatjcgqi.supabase.co` — live, auth healthy (`/auth/v1/health` 200).
Publishable key in `supabase-config.js` is valid (table probes return Postgres
`42501`, not an auth failure).

### Learner tables — exist, RLS-locked to `authenticated` (correct)

`learner_profiles`, `learner_skill_progress`, `learning_sessions`,
`learning_attempts`, `review_schedule`, `reward_transactions`

Confirmed present by `42501 permission denied` (the table resolves; the `anon`
role simply has no grant). Policies are owner-scoped via `parent_user_id = auth.uid()`.

Migration `20260909_adaptive_acceleration_state.sql` is recorded as applied and
adds `adaptive_state`, `domain_levels`, `learning_velocity` to `learner_profiles`
and `independent_success`, `completion_quality`, `challenge_mode`,
`curriculum_level`, `adaptive_decision` to `learning_attempts`.

### Curriculum tables — exist, seeded, anon-readable (correct: reference data)

Active version `2026.09.08-v2`.

| table | rows |
|---|---|
| curriculum_versions | 2 (`2026.09.07-v1`, `2026.09.08-v2`) |
| curriculum_domains | 6 |
| curriculum_strands | 28 |
| curriculum_skills | 48 |
| skill_prerequisites | 37 |

## Phase 4 validation against the live graph — PASS

Every criterion in the Phase 4 spec, run against the live rows:

- zero duplicate skill ids — ok
- prerequisite endpoints all resolve — ok
- skills reference real domains and strands — ok
- strands reference real domains — ok
- `recommended_next` pointers all resolve — ok
- zero prerequisite loops — ok
- zero `recommended_next` loops — ok
- zero orphan skills — ok
- every domain has an entry point — ok
- every skill `active` — ok

Per-domain coverage (skills / difficulty levels present):

| domain | skills | levels |
|---|---|---|
| reading | 11 | 1-5 |
| math | 10 | 1-4 |
| language | 8 | 1-4 |
| logic | 6 | 1-3 |
| science | 8 | 1-3 |
| writing | 5 | 1-4 |

The graph already covers the Phase 5 skill list almost exactly: mixed CVC, CVC
encoding, short vowels, digraphs, blends, sentences, decodable stories,
vocabulary; number composition, addition, subtraction, number bonds, missing
parts, patterns, spatial, measurement; WH/retell/sequence/prediction; word
building, labels, sentence stems; multi-level patterns, deduction, early coding,
habitats, plant growth, weather, float/sink, magnets, light/sound, space.

Snapshotted to `curriculum-snapshot.json` so the client has an offline source
and the graph is diffable in git.

## Edge functions

`sakhi-tts` — deployed. Enforces an Origin allowlist (returns
`403 {"error":"Origin not allowed"}` for non-allowlisted callers). Not broken.

## Assets

| | |
|---|---|
| phoneme audio | 2 files only — `phoneme_t.ogg`, `phoneme_p.ogg` |
| image atlases | `assets/atlas-1.b64`, `atlas-2.b64`, `atlas-3.b64` |
| icons | `unicorn-icon.svg` + `icon-180/192/512.png` |

Phase 7 requires ~25 validated phonemes. **23 are missing.**

## Tests

`tests/runtime.spec.js`, `daily-journey.spec.js`, `adaptive-acceleration.spec.js`,
`settings-controls.spec.js`, `pwa-update.spec.js` (Playwright 1.55, devDependency,
not installed locally).

Of 10 `scripts/validate-*.cjs`, five fail at `main` — they validate the runtime
that `b253d22` deleted. Pre-existing. Only `validate-production-app.cjs` gates deploy.

## Learner data safety

No destructive operation performed. All Supabase access this session was
read-only (`GET`) against anon-readable curriculum tables. No learner row was
read, written, or deleted; no local storage key was cleared outside a disposable
test browser profile.
