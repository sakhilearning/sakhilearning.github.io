# Sakhi Learning Trails V3 release guide

Baseline: `bb388ed14f721c25c3fb2140481e2913e8ed9bc8`
Curriculum: `2026.09.10-v3`

## What this upgrade changes

- replaces mood-style world selection with six stable subject learning trails;
- expands the curriculum to 85 skills while retaining all 48 V2 skill IDs;
- provides 26 weeks / 130 planned days / 65 hours of intended learning;
- keeps Reading and Math in every planned day;
- includes daily movement, pencil/handwriting and family-talk work;
- keeps adaptive prerequisite substitution and spaced review within the same subject trail;
- moves placement evidence through `SakhiProgress.completeActivity()`;
- separates correctness from independence in Parent Dashboard reporting;
- adds cloud dead-letter protection rather than silently dropping rejected writes;
- adds V3 plan/report metadata migration and weekly parent-email function;
- makes CSS cascade ownership explicit instead of relying on last-rule-wins;
- preserves the existing Supabase public config and phoneme assets during install.

## Automated acceptance

Run:

```bash
npm ci
npm run qa
```

Expected release-candidate result:

- 16 JavaScript files pass syntax validation
- 85 curriculum skills / 72 prerequisite edges valid
- 8,500 generated activity cases pass
- all five bands generate for every skill
- placement/adaptive/mastery/reward regressions pass
- fixed trail presentation cannot change skill/difficulty/answer
- 26 weeks / 130 days / 3,900 minutes validate
- 25/30/35-minute session preferences map to 3/4/5 app blocks
- CSS has no `!important` and no conflicting selector ownership in one layer/context
- all referenced local assets and PWA modules resolve

## Manual device smoke checklist

Use Safari on the primary iPad/iPhone if that is the child's normal device.

1. Home loads with no broken image and no visible technical error.
2. Tap Start. Audio is allowed from that first gesture.
3. Complete all four placement probes on a fresh profile.
4. Start the first planned day and confirm subject worlds stay stable:
   - Reading -> Rainbow Reading Trail
   - Math -> Crystal Number Palace
   - Writing -> Butterfly Letter Studio
   - Language -> Enchanted Story Library
   - Logic -> Royal Puzzle Ballroom
   - Science -> Mermaid Discovery Lagoon
5. Try a wrong answer once; the child gets a gentle scaffold/retry rather than punishment.
6. Use Hear Again. Narration must not overlap itself after navigation.
7. Use a hint and confirm Parent Dashboard later shows support rather than counting it as independent.
8. Complete the off-screen movement/pencil/family mission and confirm the plan day advances.
9. Open My Trails and confirm landmarks/progress are meaningful and readable.
10. Open Treasures and confirm rewards survive a page refresh.
11. Enter Parent Dashboard using the grown-up arithmetic gate.
12. Test 25-, 30-, and 35-minute session settings on separate disposable sessions if desired.
13. With Family Sync signed in, press Sync now and verify the dashboard says Connected only after a real authenticated request.
14. Turn Wi-Fi off, finish one activity, reconnect, then confirm the queued write clears rather than being lost.
15. Rotate portrait/landscape and verify touch targets remain comfortable.
16. Enable Reduced Motion and verify the interface still communicates progress without distracting animation.

## Supabase V3 upgrade

The app can be previewed from the bundled curriculum before cloud migration.
Before production family sync/reporting, apply migrations in order if needed:

1. `migrations/20260909_theme_configuration.sql`
2. `migrations/20260910_v3_foundation.sql`

Do not put the Supabase service-role key, ElevenLabs API key or Resend API key in
browser JavaScript or GitHub source.

## Weekly parent email

The server function is:

`supabase/functions/weekly-report/index.ts`

Required **Supabase Edge Function secrets**:

- `RESEND_API_KEY`
- `SAKHI_WEEKLY_REPORT_CRON_SECRET`
- `SAKHI_REPORT_FROM_EMAIL`

Supabase automatically provides its URL/service-role environment values to Edge
Functions when configured in the project.

The GitHub scheduled workflow needs only:

- `SAKHI_WEEKLY_REPORT_URL`
- `SAKHI_WEEKLY_REPORT_CRON_SECRET`

The report shows unique practice days, active minutes, tasks, plan progress,
correctness, independence, and growing/support skills. It does not create a
single intelligence or ability score.

## Audio quality gate

The existing local `/t/` and `/p/` recordings are preserved by the installer.
Other pure phonemes may use the dedicated ElevenLabs phoneme request, but they
should be listened to and approved once before being treated as validated local
instructional audio. Generic browser TTS is never used for a pure phoneme.

## Commit and push after smoke testing

```bash
git status
git diff --stat
git add .
git commit -m "Upgrade Sakhi to Learning Trails V3"
git push -u origin upgrade/sakhi-v3
```

Then open a pull request or inspect the branch diff before merging to `main`.
