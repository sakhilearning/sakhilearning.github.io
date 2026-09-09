# Sakhi Supabase

Supabase is the durable source of truth for authenticated learner state: profiles, settings, sessions, attempts, mastery, review schedule, rewards, and curriculum state.

Activity completion must use one authoritative atomic/idempotent database operation. RLS must be tested using authenticated parent identities and must prevent one parent from reading or modifying another learner's rows.

Browser storage is only a cache/offline bridge after family authentication.
