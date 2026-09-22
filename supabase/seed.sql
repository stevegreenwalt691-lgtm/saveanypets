-- Sample data for local development and preview deploys only.
-- Never run this against production.

insert into pets (
  slug, name, species, breed, sex, size, birth_date, weight_kg, length_cm,
  story, personality, good_with_kids, good_with_dogs, good_with_cats,
  vaccinated, spayed_neutered, vet_checked, health_notes, care_needs,
  adoption_fee, status, featured, intake_date
) values
  ('rex', 'Rex', 'dog', 'Labrador mix', 'male', 'large', '2022-03-10', 28.5, null,
   'Rex loves long walks and chasing tennis balls. He is gentle with children and settles quickly in a new home.',
   array['playful', 'loyal', 'energetic'], true, true, false,
   true, true, true, null, array['daily walks', 'a yard to run in'],
   150.00, 'available', true, current_date - 14),

  ('biscuit', 'Biscuit', 'dog', 'Beagle', 'female', 'medium', '2021-07-22', 12.0, null,
   'Biscuit is a curious beagle with a big nose for adventure. She does best with an experienced dog owner.',
   array['curious', 'vocal', 'affectionate'], true, false, true,
   true, true, true, null, array['a secure fence', 'scent games'],
   150.00, 'available', false, current_date - 30),

  ('nala', 'Nala', 'dog', 'Mixed breed', 'female', 'small', '2023-01-05', 8.2, null,
   'Nala was found as a stray and has blossomed into a sweet, cuddly companion.',
   array['gentle', 'shy at first', 'cuddly'], true, true, true,
   true, true, true, 'Mild skin allergy, managed with diet', array['a calm home', 'hypoallergenic food'],
   120.00, 'available', false, current_date - 5),

  ('whiskers', 'Whiskers', 'cat', 'Domestic shorthair', 'male', 'medium', '2020-05-18', 4.8, null,
   'Whiskers is a laid back lap cat who loves sunny windowsills and gentle chin scratches.',
   array['calm', 'affectionate', 'independent'], true, null, true,
   true, true, true, null, array['a scratching post', 'a quiet corner'],
   80.00, 'available', true, current_date - 20),

  ('luna', 'Luna', 'cat', 'Siamese mix', 'female', 'small', '2022-11-02', 3.6, null,
   'Luna is a chatty, playful cat who loves feather toys and following her favourite people from room to room.',
   array['playful', 'talkative', 'social'], true, null, false,
   true, true, true, null, array['interactive toys', 'another confident cat or none'],
   80.00, 'available', false, current_date - 9),

  ('mochi', 'Mochi', 'cat', 'Domestic longhair', 'female', 'medium', '2019-09-30', 5.1, null,
   'Mochi is a gentle senior who enjoys quiet company and a soft bed by the window.',
   array['gentle', 'quiet', 'low energy'], true, null, true,
   true, true, true, 'Mild arthritis, does well on soft bedding', array['a low stress home', 'orthopedic bedding'],
   60.00, 'available', false, current_date - 40),

  ('spike', 'Spike', 'bearded_dragon', 'Central bearded dragon', 'male', null, '2023-04-12', null, 42.0,
   'Spike is a calm, easy going dragon who enjoys basking under his lamp and gentle handling.',
   array['calm', 'curious', 'easy to handle'], true, null, null,
   false, false, true, null, array['UVB lighting', 'a 40 gallon tank', 'a varied insect and veg diet'],
   100.00, 'available', true, current_date - 25),

  ('ember', 'Ember', 'bearded_dragon', 'Central bearded dragon', 'female', null, '2022-08-19', null, 48.5,
   'Ember has a bold personality and loves exploring outside her tank under close supervision.',
   array['bold', 'active', 'food motivated'], true, null, null,
   false, false, true, null, array['UVB lighting', 'a 40 gallon tank', 'supervised out of tank time'],
   100.00, 'available', false, current_date - 12),

  ('pepper', 'Pepper', 'bearded_dragon', 'Central bearded dragon', 'male', null, '2021-12-01', null, 51.0,
   'Pepper is a laid back adult dragon, a great choice for a first time reptile owner with the right setup.',
   array['docile', 'low maintenance', 'good for beginners'], true, null, null,
   false, false, true, null, array['UVB lighting', 'a 40 gallon tank', 'a warm basking spot'],
   100.00, 'available', false, current_date - 60)
on conflict (slug) do nothing;

-- Meet and greet slots for the next 7 days, 3 per day.
insert into meet_slots (starts_at, capacity, is_open)
select
  (current_date + offset_days)::timestamptz + slot_time,
  1,
  true
from generate_series(1, 7) as offset_days
cross join (
  values (interval '10 hours'), (interval '13 hours'), (interval '15 hours 30 minutes')
) as slots(slot_time);
