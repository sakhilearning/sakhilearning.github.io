drop policy if exists "family owns sakhi events" on public.sakhi_v3_events;

create policy "family owns sakhi events"
on public.sakhi_v3_events
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
