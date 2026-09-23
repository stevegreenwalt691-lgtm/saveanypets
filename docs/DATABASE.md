# Save Any Pets: database (Supabase)

All tables live in the `public` schema with **RLS enabled**. The anon key is public, so policies are the real security.

Create each block below as its own migration:

```cmd
npx supabase migration new init_enums
npx supabase db push
npx supabase gen types typescript --linked > src\lib\supabase\database.types.ts
```

## 1. Enums

```sql
create type species as enum ('dog', 'cat', 'bearded_dragon');
create type pet_sex as enum ('male', 'female', 'unknown');
create type pet_size as enum ('small', 'medium', 'large');
create type pet_status as enum ('draft', 'available', 'pending', 'adopted', 'on_hold');
create type application_status as enum ('new', 'in_review', 'approved', 'declined', 'completed', 'withdrawn');
create type staff_role as enum ('admin', 'staff');
create type signup_type as enum ('foster', 'volunteer');
```

## 2. Staff profiles and helper

```sql
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role staff_role not null default 'staff',
  created_at timestamptz not null default now()
);

create or replace function is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid());
$$;

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

Staff accounts are created by an admin in the Supabase dashboard (Auth > Users > Invite), then a row is added to `profiles`. Turn **off** public sign-ups in Auth settings.

## 3. Pets

```sql
create table pets (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  species species not null,
  breed text,
  sex pet_sex not null default 'unknown',
  size pet_size,
  birth_date date,                   -- approximate is fine; age is calculated
  weight_kg numeric(5,2),
  length_cm numeric(5,1),            -- mainly for bearded dragons
  story text,
  personality text[] not null default '{}',
  good_with_kids boolean,
  good_with_dogs boolean,
  good_with_cats boolean,
  vaccinated boolean not null default false,
  spayed_neutered boolean not null default false,
  vet_checked boolean not null default false,
  health_notes text,
  care_needs text[] not null default '{}',
  adoption_fee numeric(10,2),
  status pet_status not null default 'draft',
  featured boolean not null default false,
  video_url text,
  intake_date date not null default current_date,
  adopted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pets_public_idx on pets (status, species);
create trigger pets_updated before update on pets for each row execute function set_updated_at();

create table pet_photos (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references pets (id) on delete cascade,
  path text not null,                -- path inside the pet-photos bucket
  alt text,
  is_primary boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create unique index one_primary_photo on pet_photos (pet_id) where is_primary;
```

## 4. Meet-and-greet slots and applications

```sql
create table meet_slots (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  capacity int not null default 1,
  is_open boolean not null default true
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references pets (id) on delete restrict,
  slot_id uuid references meet_slots (id) on delete set null,
  -- about you
  full_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  -- home
  home_type text not null,
  owns_home boolean not null,
  landlord_allows_pets boolean,
  has_secure_outdoor_space boolean,
  household_size int,
  hours_alone int,
  -- experience
  current_pets text,
  reptile_experience text,           -- only asked for bearded dragons
  has_uvb_setup boolean,             -- only asked for bearded dragons
  reason text not null,
  agreed_to_terms boolean not null default false,
  -- staff
  status application_status not null default 'new',
  staff_notes text,
  reviewed_by uuid references profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index applications_status_idx on applications (status, created_at desc);
create trigger applications_updated before update on applications for each row execute function set_updated_at();

-- keep pet status in sync with application decisions
create or replace function sync_pet_status()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    update pets set status = 'pending' where id = new.pet_id and status = 'available';
  elsif new.status = 'completed' and old.status is distinct from 'completed' then
    update pets set status = 'adopted', adopted_at = now() where id = new.pet_id;
  end if;
  return new;
end;
$$;
create trigger applications_sync_pet after update of status on applications
for each row execute function sync_pet_status();
```

## 5. Content and sign-ups

```sql
create table care_guides (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  species species,                   -- null = general
  title text not null,
  summary text,
  body_md text not null,
  cover_path text,
  published boolean not null default false,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table success_stories (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references pets (id) on delete set null,
  title text not null,
  body text not null,
  adopter_first_name text,
  photo_path text,
  consent_given boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  constraint story_needs_consent check (not published or consent_given)
);

create table people_signups (
  id uuid primary key default gen_random_uuid(),
  type signup_type not null,
  full_name text not null,
  email text not null,
  phone text,
  species_interest species[] not null default '{}',
  message text,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create table surrenders (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  email text,
  phone text not null,
  species species not null,
  pet_name text,
  pet_age text,
  reason text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create table site_settings (
  id int primary key default 1 check (id = 1),   -- single row
  shelter_name text not null default 'Save Any Pets',
  address text,
  phone text,
  whatsapp text,
  email text,
  registration_number text,
  opening_hours jsonb,
  fees jsonb,                        -- {"dog": 0, "cat": 0, "bearded_dragon": 0}
  donation_details text,             -- bank transfer details shown on /get-involved#donate. No online payment, ever.
  updated_at timestamptz not null default now()
);
insert into site_settings (id) values (1);
```

## 6. Row Level Security

```sql
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
```

Notes:

- Public forms do not need to read back their row, so insert with `.insert(...)` and **no** `.select()` (a select would be blocked).
- Slot capacity: check in the server action (count applications per `slot_id`) before inserting. A slot that is full is hidden from the picker.
- Rate limit and Turnstile run in the server action before the insert.

### Security definer functions (Phase 4)

The `applications` table has no public select policy, so the browser cannot count bookings per slot
or tell an `adopted` pet apart from one that does not exist. Three `security definer` functions
expose just enough for the apply flow, added in `20260923104451_application_support.sql`:

```sql
pet_status_for_slug(p_slug text) returns pet_status
-- Status of a pet by slug, only for 'available' | 'pending' | 'on_hold' | 'adopted'.
-- Used to show "this pet has been adopted" instead of a plain 404 (draft pets stay hidden).

open_meet_slots() returns table (id uuid, starts_at timestamptz, capacity int, booked bigint)
-- Open, future slots that still have room. Full slots are excluded (having count(a.id) < s.capacity).

meet_slot_has_capacity(p_slot_id uuid) returns boolean
-- Re-checked in the server action right before insert, to close a race between
-- loading the form and submitting it.
```

All three are granted `execute` to `anon, authenticated`. Call them with `supabase.rpc(...)`.

## 7. Storage

| Bucket | Public | Who can write |
| --- | --- | --- |
| `pet-photos` | yes (read) | staff |
| `story-photos` | yes (read) | staff |
| `guide-covers` | yes (read) | staff |

```sql
insert into storage.buckets (id, name, public)
values
  ('pet-photos', 'pet-photos', true),
  ('story-photos', 'story-photos', true),
  ('guide-covers', 'guide-covers', true)
on conflict (id) do nothing;

create policy staff_write_media on storage.objects for all to authenticated
  using (bucket_id in ('pet-photos', 'story-photos', 'guide-covers') and is_staff())
  with check (bucket_id in ('pet-photos', 'story-photos', 'guide-covers') and is_staff());
```

Path pattern: `pet-photos/{pet_id}/{uuid}.webp`. Resize to max 1600px wide before upload (in the browser) to keep storage small.

## 8. Seed data (local and preview only)

`supabase/seed.sql` adds 9 pets (3 dogs, 3 cats, 3 bearded dragons) with status `available` and a few `meet_slots` for the next 7 days. Never run the seed on production.

Three starter `care_guides` (one per species) ship as a real migration instead of seed data, since
they are content meant for production too: `20260923163720_care_guides_starter_content.sql`. Each
body starts with `Reviewed by: [VET OR STAFF NAME]`, a reminder for the client to check them before
launch.

## 9. Test checklist for RLS

Run in the SQL editor using "Run as anon":

- `select * from applications;` returns 0 rows
- `select * from pets where status = 'draft';` returns 0 rows
- `insert into applications (... status = 'approved')` is rejected
- `update pets set status = 'adopted';` is rejected
