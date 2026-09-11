create table if not exists public.sakhi_v3_events (
  id text primary key,
  at timestamptz not null default now(),
  skill_id text not null,
  domain_id text not null,
  objective boolean not null default true,
  correct_questions int not null default 0,
  total_questions int not null default 0,
  independent_questions int not null default 0,
  hints int not null default 0,
  band int not null default 1,
  user_id uuid not null default auth.uid()
);
alter table public.sakhi_v3_events enable row level security;
drop policy if exists "family owns sakhi events" on public.sakhi_v3_events;
create policy "family owns sakhi events" on public.sakhi_v3_events for all to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
grant select,insert,update on public.sakhi_v3_events to authenticated;
