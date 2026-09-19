-- Sakhi V4 family snapshot sync.
-- The browser keeps an offline-first learner state and mirrors one authoritative
-- family-owned snapshot here after authentication. Existing learner tables stay
-- intact for future normalized reporting.

create table if not exists public.sakhi_family_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  snapshot jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.sakhi_family_state enable row level security;

drop policy if exists sakhi_family_state_select_owner on public.sakhi_family_state;
create policy sakhi_family_state_select_owner
  on public.sakhi_family_state for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists sakhi_family_state_insert_owner on public.sakhi_family_state;
create policy sakhi_family_state_insert_owner
  on public.sakhi_family_state for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists sakhi_family_state_update_owner on public.sakhi_family_state;
create policy sakhi_family_state_update_owner
  on public.sakhi_family_state for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists sakhi_family_state_delete_owner on public.sakhi_family_state;
create policy sakhi_family_state_delete_owner
  on public.sakhi_family_state for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.sakhi_family_state to authenticated;
