alter table profiles enable row level security;
alter table pets enable row level security;
alter table pet_photos enable row level security;
alter table meet_slots enable row level security;
alter table applications enable row level security;
alter table care_guides enable row level security;
alter table success_stories enable row level security;
alter table people_signups enable row level security;
alter table surrenders enable row level security;
alter table site_settings enable row level security;

-- staff can do everything on every table
create policy staff_all on pets for all to authenticated using (is_staff()) with check (is_staff());
create policy staff_all on pet_photos for all to authenticated using (is_staff()) with check (is_staff());
create policy staff_all on meet_slots for all to authenticated using (is_staff()) with check (is_staff());
create policy staff_all on applications for all to authenticated using (is_staff()) with check (is_staff());
create policy staff_all on care_guides for all to authenticated using (is_staff()) with check (is_staff());
create policy staff_all on success_stories for all to authenticated using (is_staff()) with check (is_staff());
create policy staff_all on people_signups for all to authenticated using (is_staff()) with check (is_staff());
create policy staff_all on surrenders for all to authenticated using (is_staff()) with check (is_staff());
create policy staff_read on profiles for select to authenticated using (is_staff());
create policy admin_write on profiles for all to authenticated using (is_admin()) with check (is_admin());
create policy admin_write on site_settings for all to authenticated using (is_admin()) with check (is_admin());

-- public reads
create policy public_read on pets for select to anon, authenticated
  using (status in ('available', 'pending', 'on_hold'));
create policy public_read on pet_photos for select to anon, authenticated
  using (exists (select 1 from pets p where p.id = pet_id and p.status in ('available', 'pending', 'on_hold')));
create policy public_read on meet_slots for select to anon, authenticated
  using (is_open and starts_at > now());
create policy public_read on care_guides for select to anon, authenticated using (published);
create policy public_read on success_stories for select to anon, authenticated using (published);
create policy public_read on site_settings for select to anon, authenticated using (true);

-- public inserts (forms). No public select on these tables.
create policy public_insert on applications for insert to anon, authenticated
  with check (status = 'new' and staff_notes is null and reviewed_by is null);
create policy public_insert on people_signups for insert to anon, authenticated with check (handled = false);
create policy public_insert on surrenders for insert to anon, authenticated with check (handled = false);
