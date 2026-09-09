# Sakhi Magic Learning Architecture

This document defines the source of truth for each major application system. Feature code must consume these services rather than redefining or wrapping global behavior.

| Concern | Authoritative source | Public API |
|---|---|---|
| Audio | `speech-service.js` | `SpeechService` |
| Visual assets/scenes | `asset-service.js` + `ASSET_STRATEGY.md` | `AssetService` |
| Curriculum graph | `curriculum.js` + adapter in `core-learning-services.js` | `CurriculumEngine` |
| Mastery/review | `core-learning-services.js` | `MasteryEngine` |
| Daily planning | `core-learning-services.js` | `LessonPlanner` |
| Activity contract + lifecycle | `activity-contract.js` + `interaction-engine.js` | `ActivityContract`, `ActivityRenderer`, `ActivityStateMachine` |
| Progress persistence | `persistence.js` through `progress-service.js` | `ProgressService` |
| Rewards | `reward-service.js` | `RewardService` |
| Parent authentication | `parent-auth-service.js` | `ParentAuthService` |
| Learner profile | `core-learning-services.js` | `LearnerProfileService` |
| AI content policy | `core-learning-services.js` | `AIContentService` |
| Parent reporting UI | `adaptive-engine.js` | `AdaptiveParentUI` |
| Family sync UI | `backend-bridge.js` | `FamilySyncUI` |

## Ownership rules

1. Only `speech-service.js` may select a speech provider, voice, model, fallback, playback mechanism, or cache speech.
2. Critical phoneme pronunciation must ultimately come from a validated phoneme asset bank. Neural phoneme generation is transitional and must not be considered curriculum-verified.
3. Only `AssetService` decides which recurring world/asset represents an activity or domain. Individual lessons must not hotlink or independently search for imagery.
4. Character/image acquisition follows `ASSET_STRATEGY.md`: inventory first, user-provided assets first, then existing high-quality project assets, then publicly accessible imagery only where technically and legally appropriate, then generated/original supporting art.
5. Selected imagery is referenced through stable asset IDs and provenance metadata. Remote third-party URLs are discovery inputs, not permanent runtime dependencies.
6. Existing good parent-preferred visuals are preserved unless explicitly classified as UPGRADE, REPLACE, or BROKEN.
7. Only `MasteryEngine` derives skill state and review timing.
8. Only `LessonPlanner` selects the recommended daily activity sequence.
9. `UIHooks` is the single compatibility interception layer around legacy renderer/navigation functions. Other files must subscribe to hooks rather than wrap those functions again.
10. `ProgressService` owns synchronization. Supabase is authoritative after family authentication; browser storage is a cache/offline bridge, not the durable source of truth.
11. `ParentAuthService` owns passcode verification, unlock state and inactivity expiry. Child-facing code never contains the passcode in plaintext.
12. Curriculum facts, phonics mappings, arithmetic answers and prerequisite relationships come from vetted deterministic data. AI may provide story wrappers, dialogue and safe variation only after validation.
13. New code must not introduce `fix`, `hotfix`, `override`, `patch`, or duplicate provider/service layers as architecture.

## Character and image system

`AssetService` owns the character library, stable IDs, category paths, educational-role associations, quality rules, fallbacks, inventory metadata and preload behavior. Character imagery is a motivation/story layer; instructional objects remain visually clean and concept-focused.

The application may support familiar worlds and characters when suitable assets are available. Suggested recurring associations include Belle for stories/vocabulary/comprehension, Ariel for ocean science/counting/sorting, Elsa and Anna for number/pattern/spatial/winter activities, Rapunzel for creativity/sequencing, Cinderella for matching/routines/time, Mickey and Minnie for playful review, Winnie the Pooh for stories/emotions/friendship, and Luna/unicorns for phonics, reading and rewards. These associations are not permanent subject restrictions.

The current repository is publicly accessible even though the application is intended for family use. Third-party copyrighted character imagery must therefore not be committed merely because the intended audience is private; storage must still be technically and legally appropriate.

## Current migration status

The repository is being migrated from a historically layered static app. Compatibility aliases may exist temporarily where the old renderer expects global names, but business logic must delegate to the services above. The migration is not complete until obsolete definitions have been removed and the full learner loop passes simulated and live tests.
