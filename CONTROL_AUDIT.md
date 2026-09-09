# Sakhi control and settings audit

This audit is the internal shipping record for visible controls. A visible control must have one conceptual owner, persistent state where applicable, and an observable effect.

| Control | Visible location | Intended purpose | State source | Persistence | Components affected | Result | Decision |
|---|---|---|---|---|---|---|---|
| Start Today's Adventure | Child Home | Start adaptive session | Quest state | learner progress | Quest planner / activity runner | PASS | KEEP |
| Story Castle / Number Kingdom / Puzzle Palace / Discovery World / Create & Play | Child Home | Open domain exploration | navigation only | n/a | Learn domain view | PASS | KEEP |
| Home / Quest / Rewards | Child navigation | Primary child navigation | view state | n/a | main views | PASS | KEEP |
| Parents | Child navigation | Enter protected Parent Mode | ParentAuthService | sessionStorage with inactivity expiry | Parent view | PASS | KEEP |
| Legacy Adventure dropdown | Old hero | Former theme selector | legacy `data.theme` | local cache only | partial theme styling | HIDDEN | REMOVE FROM VISIBLE UI; compatibility shim only |
| Learn / Reading Baseline nav items | Old main navigation | Adult/general navigation | view state | n/a | learn/baseline views | HIDDEN | REMOVE FROM CHILD NAV; parent/tools still access them |
| Today's Adventure Theme | Parent Settings | Presentation world only | SettingsService + AdventureService | `adaptiveProfile.settings` via family profile sync + local cache | background, scene, story wrapper, reward style | PASS | KEEP |
| Session Length | Parent Settings | Target session duration | SettingsService | same | quest activity count/depth | PASS | KEEP |
| Sakhi Voice | Parent Settings | Enable/disable spoken guidance | SettingsService | same | SpeechService | PASS | KEEP |
| Movement Breaks | Parent Settings | Include/exclude movement missions | SettingsService | same | quest planner | PASS | KEEP |
| Reduced Motion | Parent Settings | Reduce decorative motion | SettingsService | same | UI motion | PASS | KEEP |
| Family Progress Sync actions | Parent Mode | authenticate/sync/disconnect family profile | ProgressService | Supabase | learner progress/settings | PASS | KEEP |
| Manual skill state selectors | Parent Progress | parent correction/override | learner skill state | learner profile sync | mastery reporting/planning | PASS | KEEP |
| Reading baseline answer buttons/reset | Adult-guided baseline | placement evidence | learner baseline state | learner progress cache/profile pipeline | baseline/readiness | PASS | KEEP |
| Lesson observation selects/notes | Adult-guided lesson | capture observed support needs | learner observation state | local learner data | next-focus coaching | PASS | KEEP |

## Adventure rule

AdventureService is presentation-only. It may choose a visual/story world but never chooses curriculum skill progression. AUTO is the default. Only worlds with complete built-in scene support are exposed. Branded character worlds remain hidden until complete, permitted, registered local assets exist.

## Settings source of truth

`SettingsService` is the conceptual owner. Settings are mirrored to `data.settings` and `data.adaptiveProfile.settings`; when Family Sync is authenticated, the existing profile snapshot sync persists `adaptiveProfile.settings` in Supabase. Browser storage is only the local cache.

## QA rule

The Parent Settings QA table must contain no `UNKNOWN` or `NO EFFECT` rows. A control that fails this rule is removed from the visible UI until its behavior is implemented.
