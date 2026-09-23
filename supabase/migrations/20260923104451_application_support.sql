-- Support functions for the adoption application flow (Phase 4).
-- The applications table has no public select policy, so the browser
-- cannot count bookings per slot or tell "adopted" apart from "not found"
-- for a pet outside the public_read status list. These security definer
-- functions expose just enough, nothing else.

-- Status of a pet by slug, but only for statuses we are willing to reveal
-- to a visitor (so a draft pet's existence is not leaked). Used by the
-- apply page to show a friendly "already adopted" message instead of a
-- plain 404.
create or replace function pet_status_for_slug(p_slug text)
returns pet_status
language sql stable security definer set search_path = public as $$
  select status from pets
  where slug = p_slug
    and status in ('available', 'pending', 'on_hold', 'adopted');
$$;

grant execute on function pet_status_for_slug(text) to anon, authenticated;

-- Open, future meet and greet slots that still have room, with a booked
-- count so the picker can hide full slots without exposing the
-- applications table itself.
create or replace function open_meet_slots()
returns table (id uuid, starts_at timestamptz, capacity int, booked bigint)
language sql stable security definer set search_path = public as $$
  select s.id, s.starts_at, s.capacity, count(a.id) as booked
  from meet_slots s
  left join applications a on a.slot_id = s.id
  where s.is_open and s.starts_at > now()
  group by s.id, s.starts_at, s.capacity
  having count(a.id) < s.capacity
  order by s.starts_at;
$$;

grant execute on function open_meet_slots() to anon, authenticated;

-- Re-check right before insert that a slot is still open, in the future
-- and not full (protects against a race between loading the form and
-- submitting it).
create or replace function meet_slot_has_capacity(p_slot_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    (
      select count(a.id) < s.capacity
      from meet_slots s
      left join applications a on a.slot_id = s.id
      where s.id = p_slot_id and s.is_open and s.starts_at > now()
      group by s.id, s.capacity
    ),
    false
  );
$$;

grant execute on function meet_slot_has_capacity(uuid) to anon, authenticated;
