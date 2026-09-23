-- Three starter care guides, one per species. General and practical, not written for a
-- specific pet. Each is flagged for review before launch and published so /care-guides
-- has real content immediately.

insert into care_guides (slug, species, title, summary, body_md, published, published_at)
values
(
  'first-week-rescue-dog',
  'dog',
  'The first week with a rescue dog',
  'What to expect and how to help a new dog settle in during their first days home.',
$md$Reviewed by: [VET OR STAFF NAME]

# The first week with a rescue dog

Bringing a rescue dog home is exciting, but the first week is an adjustment for both of you. Many dogs need time to feel safe before their real personality shows.

## Before they arrive

- Set up a quiet space with a bed, water and a few toys, away from the busiest part of the house.
- Remove anything chewable or breakable from that area.
- Buy food that matches what the shelter was feeding, and change it slowly over a week or two if you switch.

## The first few days

- Keep the household calm. Limit visitors and loud noises for the first few days.
- Stick to a simple routine: regular meal times, toilet breaks and a consistent bedtime.
- Let your dog approach you rather than reaching for them. Sniffing and cautious distance are normal.
- Some dogs eat less, pace, or seem withdrawn at first. This usually settles within a week or two.

## Toilet training

- Take your dog out often, especially after waking up, eating and playing.
- Praise calmly when they go outside. Do not punish accidents indoors, just clean up and try again.

## Meeting the rest of the family

- Introduce other pets slowly, on neutral ground if possible, and always supervised.
- Let children approach calmly and avoid hugging or crowding a new dog until trust is built.

## When to call us

Reach out if your dog is not eating at all after 48 hours, seems unwell, or you are worried about
a behaviour you were not expecting. We are here to help even after adoption day.
$md$,
  true,
  now()
),
(
  'settling-a-shy-cat',
  'cat',
  'Settling a shy cat into your home',
  'A slow, low pressure approach that helps nervous cats feel safe in a new home.',
$md$Reviewed by: [VET OR STAFF NAME]

# Settling a shy cat into your home

Cats, especially shy ones, do best when they can explore a new home at their own pace. Rushing
introductions is the most common reason a confident-sounding plan does not work.

## Start with one small room

- Choose a quiet room with a litter tray, food, water and a hiding spot such as a covered bed or box.
- Keep the door closed for the first few days so your cat can get used to the smells and sounds of
  the house without feeling overwhelmed.
- Sit in the room quietly, without reaching for your cat, so they learn your presence is safe.

## Reading the signs

- A cat pacing, hiding constantly or refusing food for more than a day needs a slower approach and
  a vet check if it continues.
- A relaxed tail, slow blinking and curiosity about the room are good signs to expand their space.

## Expanding their world

- Once your cat is eating, using the litter tray and approaching you, open the door and let them
  explore one new room at a time.
- Keep the litter tray, food and water in familiar spots even as their space grows.

## Other pets and children

- Introduce other animals through a closed door first, using scent before sight.
- Give your cat an escape route at all times, somewhere high or hidden that other pets cannot reach.

## How long it takes

Some cats settle in days, others take weeks or months. Shyness is not a reflection of how a cat
will be long term. Patience now usually means a much more confident cat later.
$md$,
  true,
  now()
),
(
  'bearded-dragon-setup-guide',
  'bearded_dragon',
  'Bearded dragon setup: tank, lighting, diet and handling',
  'Tank size, UVB and basking heat, a varied diet and low stress handling for a healthy dragon.',
$md$Reviewed by: [VET OR STAFF NAME]

# Bearded dragon setup guide

A healthy bearded dragon depends on getting the setup right before they come home. This is a
general starting point, ask us about the exact setup the pet you are adopting is used to.

## Tank size

- A single adult bearded dragon needs at least a 40 gallon tank, longer rather than taller.
- Use a secure mesh lid that still allows UVB light through, and a loose substrate free surface
  such as tile or reptile carpet while your dragon is young.

## UVB lighting

- A UVB tube light running the length of the tank is essential, bearded dragons need it to process
  calcium correctly.
- Replace UVB bulbs every 6 to 12 months even if the light still looks like it is working, UVB
  output drops long before visible light does.
- Keep the light on a regular day and night cycle, generally 10 to 12 hours a day.

## Basking heat

- Provide a basking spot at one end of the tank, with a cooler end for your dragon to move to.
- Check temperatures with a thermometer rather than guessing, and adjust bulb wattage or distance
  as needed.

## Diet

- Young dragons eat mostly insects such as crickets or dubia roaches, gut loaded and dusted with
  calcium powder.
- Adults eat more leafy greens and vegetables, with insects a smaller part of the diet.
- Never feed wild caught insects, and avoid avocado and rhubarb, both are unsafe for dragons.

## Handling

- Support the body fully, do not grab from above or by the tail.
- Keep early handling short and calm, building up as your dragon gets used to you.
- A darkening beard or gaping mouth can be signs of stress, give your dragon space if you see this.

## When to call a vet

Contact an exotics vet if your dragon stops eating for more than a few days, has swollen limbs, or
seems lethargic. Reptiles hide illness well, so changes in behaviour are worth taking seriously.
$md$,
  true,
  now()
)
on conflict (slug) do nothing;
