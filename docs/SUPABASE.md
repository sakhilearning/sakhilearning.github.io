# Sakhi V3 Supabase

Supabase is durable authority after parent authentication. Browser storage is a
cache/offline bridge and outbox.

- `SakhiCloud` owns auth, transport, connection truth, idempotent outbox replay,
  and the dead-letter queue.
- `SakhiProgress` owns learner-state merge/reconciliation.
- `CONNECTED` is reported only after an authenticated learner-table request.
- Non-transient rejected writes are retained for attention rather than silently discarded.
- RLS must scope learner rows to the authenticated parent user.

Apply the existing 20260909 migration(s) as needed, then
`migrations/20260910_v3_foundation.sql` for V3 plan/settings/curriculum bundle
support. Weekly reporting is implemented by `supabase/functions/weekly-report`;
service-role, ElevenLabs, and Resend secrets remain server-side only.
