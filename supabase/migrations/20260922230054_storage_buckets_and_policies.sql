insert into storage.buckets (id, name, public)
values
  ('pet-photos', 'pet-photos', true),
  ('story-photos', 'story-photos', true),
  ('guide-covers', 'guide-covers', true)
on conflict (id) do nothing;

create policy staff_write_media on storage.objects for all to authenticated
  using (bucket_id in ('pet-photos', 'story-photos', 'guide-covers') and is_staff())
  with check (bucket_id in ('pet-photos', 'story-photos', 'guide-covers') and is_staff());
