# Sakhi Magic Learning Architecture

This document defines the one-source-of-truth architecture. Feature code consumes authoritative services; it does not wrap, replace, or shadow them.

| Concern | Authoritative service |
|---|---|
| Authentication/family identity | Supabase Auth via persistence layer |
| Learner profile | `LearnerProfileService` |
| Settings | `SettingsService` |
| Curriculum graph | `CurriculumEngine` |
| Mastery/review | `MasteryEngine` |
| Daily planning | `LessonPlanner` |
| Activity validation | `ActivityContract` |
| Activity rendering/lifecycle | `ActivityRenderer` / `ActivityStateMachine` |
| Progress persistence | `ProgressService` |
| Rewards | `RewardService` |
| Narration | `SpeechService` |
| Instructional phonemes | `PhonemeAudioService` |
| Visual assets | `AssetService` |
| Adventure presentation | `AdventureService` |
| Parent passcode | `ParentAuthService` |
| AI wrapper policy | `AIContentService` |
| Parent reporting | `AdaptiveParentUI` consuming curriculum/progress state |

## Rules

- File order must not determine business correctness.
- No patch/hotfix/override service layers.
- Narration and phoneme audio are separate.
- Curriculum target precedes session planning and activity selection.
- Activity completion is atomic and idempotent at the database boundary.
- Rewards never imply mastery.
- Parent reporting is derived from actual learner evidence.
- Git history/branches are the rollback mechanism; obsolete duplicate runtime code is removed rather than retained.
