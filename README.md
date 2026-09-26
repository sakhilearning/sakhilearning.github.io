# Sakhi Learning Trails 4.4.0

An offline-first Kindergarten learning app with adaptive daily lessons, parent evidence, exact resume, and bundled Kokoro narration optimized for iPad.

## What ships in 4.4.0

- 141 skills across 9 persistent subject trails.
- A 26-week, 130-day curriculum path.
- Daily Math, Science, Listening/Language, and Reading/Understanding priorities, plus rotating world, logic, wellbeing, writing, and creative work.
- Age-appropriate astronomy, living things, animal groups, herbivores/carnivores/omnivores, food chains, ecosystems, body systems, maps, timelines, inventions, cultures, and citizenship.
- Five adaptive difficulty bands. Fast independent answers increase the next question's challenge; struggle produces a smaller next step.
- Semantic question-history blocking so changing distractors cannot disguise a repeated task.
- On-device session, attempt, question, reward, setting, and exact activity-position history. A family account adds cross-device snapshot sync.
- Parent-selected subject/lesson controls and a clear “finish today and open the next day” action.
- Evidence-based parent metrics: accuracy, independence, hints, challenge level, coverage, review queue, strengths, support needs, session recommendations, and exact resume point.
- Repository-generated world artwork reused throughout the app, plus complete assessment visuals for any question that depends on a picture.

## Audio behavior

Normal narration uses the bundled Kokoro `af_heart` voice. The narration index is embedded in the app shell, the first mission is warmed on the home page, and upcoming questions are prefetched. iPad uses standard HTML audio playback and never waits for remote TTS. Browser speech synthesis and paid speech are not used for normal lesson narration.

Narration is concise by design:

- Self-explanatory questions read only the instruction.
- “Choice 1 is / Choice 2 is” is not spoken.
- Options are read only when a question explicitly requires spoken choices, using natural phrasing.
- Word-building reads the target word, never the letter bank.

Run `npm run test:narration-coverage` to confirm that all generated prompt variants have local audio.

## Local development

```bash
npm ci
npm run release
npm run preview
```

Open `http://localhost:4173`.

## Deployment

The GitHub Pages workflow builds and deploys `dist/` on pushes to `main`.

Apply the Supabase migrations before testing cross-device family history. The current snapshot table migration is:

```text
supabase/migrations/20260926090000_sakhi_family_state.sql
```

The public Supabase URL and publishable key belong in `supabase-config.js`. Never put a service-role key in browser code.

## Quality gates

`npm run release` verifies syntax, curriculum prerequisites, 105,750 activity generations, narration coverage, iPad local playback, repetition memory, adaptive progression, account sync behavior, assessment visuals, navigation, production build integrity, and a local deployment smoke test.
