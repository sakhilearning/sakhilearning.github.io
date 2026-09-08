# Sakhi Magic Learning

Sakhi Magic Learning is a touch-first, mastery-based learning PWA for a Kindergarten-age learner. It automatically plans short daily adventures from curriculum readiness, review needs, recent performance, and interaction variety.

## Architecture

The authoritative service map is documented in `ARCHITECTURE.md`. Feature code must not create competing speech, asset, mastery, lesson-planning, persistence, parent-auth, or lifecycle implementations.

## Learning model

- 15–25 minute recommended adventures
- literacy and mathematics as frequent core domains
- rotating comprehension, logic, science, memory, executive function, social-emotional learning, writing, creativity, motor, life skills and general knowledge
- repeated evidence across sessions before mastery
- spaced review and automatic next-skill selection
- touch-first interactive activities rather than static worksheets

## Audio and visuals

Narration is owned by `SpeechService` and uses the configured premium ElevenLabs route through Supabase. Critical phoneme pronunciation remains a separate quality gate and is not curriculum-verified until the validated phoneme asset bank is complete. Visual selection is owned by `AssetService`; approved user-owned/original high-resolution artwork can be added there without changing activity logic.

## Progress

`ProgressService` owns persistence. When Family Progress Sync is authenticated, Supabase is the durable source of truth and browser storage is a local cache/offline bridge.

## Hosting

Static PWA hosted at https://sakhilearning.github.io/.
