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
  updated_at timestamptz not null default now()
);
insert into site_settings (id) values (1);
