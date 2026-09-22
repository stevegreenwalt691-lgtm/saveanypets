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
