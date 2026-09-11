# Sakhi V3 control and settings audit

A visible control ships only if it has one owner, persistent state where needed,
and an observable effect.

| Control | Location | Owner/state | Observable effect | Status |
|---|---|---|---|---|
| Start Today's Adventure | Child Home | `sakhi-app.js` + `sakhi-plan.js` | starts placement or today's planned trail session | PASS |
| Home / My Trails / Treasures | Child navigation | view state | switches child views only | PASS |
| Parents | Child navigation | short arithmetic adult gate + 15-minute `sessionStorage` expiry | prevents casual child entry; **not security/authentication** | PASS |
| Session length 25/30/35 | Parent Dashboard | learner profile + `SakhiPlan.stepsForDay()` | 3 / 4 / 5 app blocks before the off-screen mission | PASS |
| Sakhi voice | Parent Dashboard | learner profile + `SakhiAudio` | enables/disables spoken guidance | PASS |
| Movement mission | Parent Dashboard | learner profile | includes/excludes the movement part of the off-screen mission | PASS |
| Reduced motion | Parent Dashboard | learner profile + body state | reduces decorative motion | PASS |
| Sign in / Create account | Parent Dashboard | `SakhiCloud` | authenticates family sync | PASS |
| Sync now / Sign out | Parent Dashboard | `SakhiProgress.syncCloud()` / `SakhiCloud` | reconciles or ends cloud session | PASS |
| Weekly email preference | Parent Dashboard | learner profile | saves report email + enabled flag for server job | PASS after V3 migration/function deployment |
| Export progress backup | Parent Dashboard | `SakhiProgress.snapshot()` | downloads JSON backup | PASS |

## Removed V2 controls

There is no child-facing mood/theme picker in V3. Subject-to-world mapping is
fixed by `sakhi-trails.js`. The legacy `active_theme` profile field exists only
for migration compatibility and does not steer V3 learning.

## Parent gate vs authentication

The arithmetic gate is deliberately only a child deterrent. Data protection is
Supabase Auth + RLS. Never treat the arithmetic gate as account security.

## QA rule

A visible control with unknown state ownership, no persistent effect, or stale
copy must be removed or fixed before release. `npm run qa` is the deploy gate.
