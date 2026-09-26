create table if not exists public.sakhi_family_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  snapshot jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.sakhi_family_state enable row level security;

drop policy if exists "family owns sakhi state" on public.sakhi_family_state;
create policy "family owns sakhi state"
on public.sakhi_family_state
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant select, insert, update on public.sakhi_family_state to authenticated;
