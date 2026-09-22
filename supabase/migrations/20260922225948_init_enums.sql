create type species as enum ('dog', 'cat', 'bearded_dragon');
create type pet_sex as enum ('male', 'female', 'unknown');
create type pet_size as enum ('small', 'medium', 'large');
create type pet_status as enum ('draft', 'available', 'pending', 'adopted', 'on_hold');
create type application_status as enum ('new', 'in_review', 'approved', 'declined', 'completed', 'withdrawn');
create type staff_role as enum ('admin', 'staff');
create type signup_type as enum ('foster', 'volunteer');
