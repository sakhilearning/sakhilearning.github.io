# Sakhi Magic Learning Architecture

This document defines the source of truth for each major application system. Feature code must consume these services rather than redefining or wrapping global behavior.

| Concern | Authoritative source | Public API |
|---|---|---|
| Audio | `speech-service.js` | `SpeechService` |
| Visual assets/scenes | `asset-service.js` | `AssetService` |
| Curriculum graph | `curriculum.js` + adapter in `core-learning-services.js` | `CurriculumEngine` |
| Mastery/review | `core-learning-services.js` | `MasteryEngine` |
| Daily planning | `core-learning-services.js` | `LessonPlanner` |
| Activity lifecycle | `interaction-engine.js` through `ui-hooks.js` | `ActivityRenderer`, `UIHooks` |
| Progress persistence | `persistence.js` through `progress-service.js` | `ProgressService` |
| Rewards | `core-learning-services.js` | `RewardService` |
| Parent authentication | `parent-auth-service.js` | `ParentAuthService` |
| Learner profile | `core-learning-services.js` | `LearnerProfileService` |
| AI content policy | `core-learning-services.js` | `AIContentService` |
| Parent reporting UI | `adaptive-engine.js` | `AdaptiveParentUI` |
| Family sync UI | `backend-bridge.js` | `FamilySyncUI` |

## Ownership rules

1. Only `speech-service.js` may select a speech provider, voice, model, fallback, playback mechanism, or cache speech.
2. Critical phoneme pronunciation must ultimately come from a validated phoneme asset bank. Neural phoneme generation is transitional and must not be considered curriculum-verified.
3. Only `AssetService` decides which recurring world/asset represents an activity or domain.
4. Only `MasteryEngine` derives skill state and review timing.
5. Only `LessonPlanner` selects the recommended daily activity sequence.
6. `UIHooks` is the single compatibility interception layer around legacy renderer/navigation functions. Other files must subscribe to hooks rather than wrap those functions again.
7. `ProgressService` owns synchronization. Supabase is authoritative after family authentication; browser storage is a cache/offline bridge, not the durable source of truth.
8. `ParentAuthService` owns passcode verification, unlock state and inactivity expiry. Child-facing code never contains the passcode in plaintext.
9. Curriculum facts, phonics mappings, arithmetic answers and prerequisite relationships come from vetted deterministic data. AI may provide story wrappers, dialogue and safe variation only after validation.
10. New code must not introduce `fix`, `hotfix`, `override`, `patch`, or duplicate provider/service layers as architecture.

## Current migration status

The repository is being migrated from a historically layered static app. Compatibility aliases may exist temporarily where the old renderer expects global names, but business logic must delegate to the services above. The migration is not complete until obsolete definitions have been removed and the full learner loop passes simulated and live tests.
