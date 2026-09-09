# Sakhi Magic Learning — Source of Truth

The governing implementation specification is maintained from the parent-provided Sakhi source-of-truth instructions. Runtime behavior must follow these rules:

- One authoritative service per concern.
- No patch/override or last-rule-wins architecture.
- Supabase is the durable source of truth after family authentication.
- Activity completion is atomic and idempotent.
- Narration and phoneme audio are separate systems.
- Curriculum target is selected before session activities.
- Parent Mode explains current stage, today's goal, why it was selected, and what comes next.
- Every major change includes regression testing across UI, audio, activity logic, persistence, rewards, mastery, and reporting.

Historical implementation prompts are reference material only and must not be concatenated into runtime behavior.
