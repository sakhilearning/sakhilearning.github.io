# Sakhi QA

Regression testing is mandatory for changes that affect UI, audio, activity logic, persistence, rewards, mastery, or parent reporting.

Current acceptance targets include:

- first-play audio initialization from the child Start gesture;
- no overlapping narration;
- validated local phoneme playback;
- visible and correct activity renderer;
- atomic, idempotent activity completion;
- Supabase persistence and RLS isolation;
- reward persistence and refresh safety;
- mastery evidence aligned with activity type;
- Parent Overview and Learning Path clarity;
- curriculum prerequisite/next-link audit;
- service-worker update behavior.
