# Validation — 4.11.0

- Base repository: `b4ba53e97d311f6eb93a7f2b2002fb09904afb39` (4.10.0).
- Baseline: full `npm run qa` passed before changes.
- Integrated release: `npm run release` passed, including source syntax/architecture, curriculum DAG, all existing regression suites, narration coverage, production build validation, and localhost deployment smoke test.
- Generator matrix: 102,500 activities / 448,500 questions over 410 skills × 5 bands × 50 seeds.
- Quality contracts: 8,200 activities / 35,880 questions; no fatal issues. 1,968 non-blocking readability/accessibility warnings remain for review.
- Narration: 3,609 reachable spoken text segments have local clips. New catalog math deliberately uses a cue; full dynamic question/hint narration remains unfinished.
- New grade/family tests: every one of 295 recovered rows mapped, 410 canonical IDs, K–6 eligibility across all nine domains, three-year rolling plans, exact 20/25/30-minute allocations, earlier-grade review priority, math oracles, prerequisite DAG, PIN verification/cooldown, time exhaustion, midnight reset, inactive-time pause, and preservation of the voice cache on service-worker upgrade.
- Parent-dashboard DOM integration: gate opening/relocking, 410-option lesson dropdown, evidence table, grade changes, worksheet and mini-lesson routing passed using a test-only gate service. No real PIN/account was created.
- Audio regression: repeating a warmed desktop clip does not fetch or decode it again. Existing iPad playback/cancellation tests passed.
- Browser smoke: local app boot, six-step daily path, parent PIN setup screen, child question launch, answer submission, automatic next question, and no observed console errors.
- Limits: parent dashboard after real PIN entry and live Supabase accounts were not manually tested in the browser; no physical iPad QA. Original uploaded curriculum files/screenshots were unavailable. Pedagogical coverage and grade assignments still need educator review.

After the full release run, the final parent render-lock and review-priority adjustments were rechecked with syntax, source architecture, navigation, adaptive pacing, learner-model, runtime-core, grade/family, and parent-dashboard tests; deployment artifacts were rebuilt and revalidated.
