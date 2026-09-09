-- Princess theme configuration + reward ledger hardening.
-- Additive and idempotent: safe to re-run, drops nothing, touches no learner row.
--
-- NOT YET APPLIED. Run in the Supabase SQL editor for project
-- okzmrlrijovbuatjcgqi, then move this note to "Applied <date>".

-- 1. Active theme lives on the learner profile. Cosmetic only: nothing in the
--    adaptive or curriculum path is allowed to read it.
alter table learner_profiles
  add column if not exists active_theme text not null default 'unicorn_meadow';

alter table learner_profiles
  add column if not exists theme_configuration jsonb not null default '{}'::jsonb;

-- Guard the column at the database level so a bad client cannot park a
-- curriculum decision in the theme slot.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'learner_profiles_active_theme_known') then
    alter table learner_profiles
      add constraint learner_profiles_active_theme_known
      check (active_theme in (
        'unicorn_meadow','royal_castle','ice_palace',
        'mermaid_lagoon','forest_glade','butterfly_cottage'
      ));
  end if;
end $$;

-- 2. Reward ledger. Transactional and idempotent by construction: the client
--    supplies transaction_id, so replaying an offline outbox converges instead
--    of double-paying.
create table if not exists reward_transactions (
  transaction_id uuid primary key,
  learner_id uuid not null references learner_profiles(learner_id) on delete cascade,
  session_id uuid references learning_sessions(session_id) on delete set null,
  attempt_id uuid,
  reward_key text not null,
  reward_label text not null,
  amount integer not null default 1,
  reason text not null,
  theme_id text,
  skill_id text,
  created_at timestamptz not null default now()
);

alter table reward_transactions add column if not exists theme_id text;
alter table reward_transactions add column if not exists skill_id text;
alter table reward_transactions add column if not exists attempt_id uuid;

create index if not exists idx_reward_tx_learner_time
  on reward_transactions(learner_id, created_at desc);
create index if not exists idx_reward_tx_key
  on reward_transactions(learner_id, reward_key);

-- A reward is earned once per (learner, reason-anchor). This is the second half
-- of idempotency: even a client that loses its transaction_id cannot double-pay
-- for the same attempt.
create unique index if not exists uniq_reward_tx_attempt
  on reward_transactions(learner_id, attempt_id, reward_key)
  where attempt_id is not null;

alter table reward_transactions enable row level security;

drop policy if exists reward_transactions_owner on reward_transactions;
create policy reward_transactions_owner on reward_transactions for all to authenticated
using (exists(select 1 from learner_profiles p
              where p.learner_id = reward_transactions.learner_id
                and p.parent_user_id = auth.uid()))
with check (exists(select 1 from learner_profiles p
                   where p.learner_id = reward_transactions.learner_id
                     and p.parent_user_id = auth.uid()));

-- 3. Balances are derived from the ledger, never stored as a mutable counter.
--    This is what makes "remove all manual UI reward-toggling" enforceable.
create or replace view reward_balances as
  select learner_id, reward_key, max(reward_label) as reward_label, sum(amount)::integer as balance
  from reward_transactions
  group by learner_id, reward_key;

-- 4. The authenticated role needs table grants on top of RLS. Without these
--    every learner-table request fails with 42501 even for a signed-in parent.
grant select, insert, update, delete on
  learner_profiles, learner_skill_progress, learning_sessions,
  learning_attempts, review_schedule, reward_transactions
  to authenticated;
grant select on reward_balances to authenticated;

-- Curriculum stays readable without a session: it is reference data, not
-- learner data, and the app must be able to render the path map before login.
grant select on
  curriculum_versions, curriculum_domains, curriculum_strands,
  curriculum_skills, skill_prerequisites
  to anon, authenticated;
