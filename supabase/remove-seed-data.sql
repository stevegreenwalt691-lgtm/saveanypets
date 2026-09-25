-- Removes the sample data from supabase/seed.sql.
--
-- This file is NOT run automatically by `supabase db push` or `supabase db reset`
-- (only supabase/seed.sql is). Run it yourself, once, against production, after
-- the client's real pets and content are ready to go live. Run it in the Supabase
-- SQL editor for the production project, not with the CLI against a local db.
--
-- Safe to run more than once, every statement only touches rows that still exist.

begin;

-- 1. The 9 sample pets (Rex, Biscuit, Nala, Whiskers, Luna, Mochi, Spike, Ember, Pepper).
--    Their pet_photos rows cascade automatically. If anyone uploaded real photos to one
--    of these pets while testing the admin panel, also delete that pet's folder in the
--    "pet-photos" storage bucket (Storage tab, folder named with the pet's id) before or
--    after running this, storage files are not removed by this script.
with seed_pets as (
  select id from pets where slug in (
    'rex', 'biscuit', 'nala', 'whiskers', 'luna', 'mochi', 'spike', 'ember', 'pepper'
  )
)
-- Applications reference pets with "on delete restrict", so any test applications
-- submitted against a sample pet while trying out the site must go first.
delete from applications where pet_id in (select id from seed_pets);

with seed_pets as (
  select id from pets where slug in (
    'rex', 'biscuit', 'nala', 'whiskers', 'luna', 'mochi', 'spike', 'ember', 'pepper'
  )
)
delete from pets where id in (select id from seed_pets);

commit;

-- 2. Care guides: NOT deleted by this script on purpose. The 3 starter guides
--    (first-week-rescue-dog, settling-a-shy-cat, bearded-dragon-setup-guide) are real,
--    general content meant to stay live, not sample data tied to the fake pets above.
--    Before launch, open each one in /admin/guides and replace the
--    "Reviewed by: [VET OR STAFF NAME]" line at the top with a real name. Only delete one
--    if you genuinely do not want it, with:
--      delete from care_guides where slug = 'the-guide-slug';

-- 3. Success stories: seed.sql never adds any (fake testimonials are against the trust
--    rules for this site), so there is normally nothing to remove here. If a test story
--    was entered by hand while trying out the feature, remove it individually with:
--      delete from success_stories where id = 'the-story-id';
--    Check `select id, title, adopter_first_name, published from success_stories;` first
--    so you only remove the test one, not a real story a client already saved.
