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
