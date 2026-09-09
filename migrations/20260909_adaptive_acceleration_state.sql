-- Adaptive acceleration persistence for Sakhi Magic Learning.
-- Applied to production Supabase on 2026-09-09.
alter table learner_profiles add column if not exists adaptive_state jsonb not null default '{}'::jsonb;
alter table learner_profiles add column if not exists domain_levels jsonb not null default '{}'::jsonb;
alter table learner_profiles add column if not exists learning_velocity numeric(8,3) not null default 0;
alter table learner_profiles add column if not exists last_session_summary text;

alter table learning_attempts add column if not exists independent_success boolean;
alter table learning_attempts add column if not exists completion_quality numeric(6,4);
alter table learning_attempts add column if not exists challenge_mode boolean not null default false;
alter table learning_attempts add column if not exists curriculum_level integer;
alter table learning_attempts add column if not exists adaptive_decision jsonb not null default '{}'::jsonb;

create index if not exists idx_attempts_adaptive_skill
  on learning_attempts(learner_id, skill_id, challenge_mode, timestamp desc);