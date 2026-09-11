# Sakhi Learning Trails V3 RC2 patch notes

RC2 is a deployment-hardening patch for the V3 trail build. It is designed to fix the failure mode visible in the deployed screenshot where the page showed the raw oversized icon, browser-default button styling, empty hero/trail areas, and no functional app initialization.

## What changed

1. **Self-contained deployment entry point.** `npm run build` now embeds the production CSS, all ordered runtime JavaScript, the 85-skill curriculum, the 26-week plan, the phoneme manifest, and the app icon directly into the generated `index.html`. GitHub Pages no longer has to load a chain of CSS/JS/data files before the app can start.
2. **CSS compatibility build.** Source CSS still uses explicit cascade layers for ownership and QA, but the deploy build flattens those layers in their declared order. Older browsers that ignore `@layer` no longer render the app as unstyled HTML.
3. **Curriculum fallback.** `SakhiCurriculum` loads embedded curriculum first and only fetches JSON when an embedded payload is not present.
4. **Six-month plan is now used by sessions.** The planner uses the 26-week/130-day plan as the pacing target while adaptive readiness remains authoritative when a planned skill is not available or needs review.
5. **Early exits do not advance the six-month program day.** A session ended with `LEFT_EARLY` is not counted as a completed learning day.
6. **Template controller reset bugs fixed.** Wrong-answer retry no longer replaces the controller with an unreachable internal controller, build-token resets correctly re-enable tokens, and synchronous render callbacks no longer dereference an unassigned controller.
7. **Retry evidence fixed.** A wrong first try followed by a supported correct try records one final question result with support, rather than duplicating question evidence.
8. **Read-only progress queries no longer create skill records.** Learning skill state is created/mutated only inside the completion path.
9. **Cloud status hardened.** `CONNECTED` is not reported merely because a token exists; an authenticated learner-data probe must succeed first.
10. **Audio false-silent behavior removed.** RC2 does not use the old short timeout that could report “Sound is on, but nothing is coming out” when playback was merely delayed. ElevenLabs through Supabase remains primary for normal narration; browser speech is fallback. Isolated phonemes remain validated-file-only.
11. **Service worker update behavior simplified.** RC2 uses a new cache name, `skipWaiting`, `clients.claim`, and network-first navigation so an old cached shell is less likely to survive a deployment.
12. **Boot failure is visible.** If runtime initialization fails, the app shows a small refresh/recovery card instead of silently leaving an empty page.
13. **Visual polish.** Trail scenes now use the Sakhi unicorn artwork as the companion portrait with a richer layered scene instead of relying only on a unicorn emoji.

## New release gates

`npm run release` runs source syntax checks, curriculum/architecture validation, 2,125 generated activity checks, 26-week plan checks, runtime-core tests, the self-contained build, and deployment validation.

The deploy validator explicitly rejects a build that still depends on external runtime JavaScript or external CSS, contains shipped `@layer` CSS, lacks embedded curriculum/plan data, or omits the 130-day plan.
