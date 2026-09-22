# Save Any Pets: design system

Direction: **Warm and Friendly + glassmorphism** (option A from the prototype canvas).
Feel: a caring local rescue, soft and inviting, but clean and trustworthy.

## 1. Colour tokens

Put these in `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* surfaces */
  --color-cream: #fbf1e6;        /* page background */
  --color-cream-admin: #f6ede4;  /* admin background */
  --color-ink: #2b211b;          /* main text, dark buttons */
  --color-ink-2: #4d3d33;        /* body text */
  --color-ink-3: #6b5547;        /* captions, labels (min 14px) */

  /* brand */
  --color-brand: #a8461f;        /* terracotta: primary buttons, links */
  --color-brand-hover: #8f3d20;
  --color-brand-tint: #fde3d6;

  /* species */
  --color-dog: #a8461f;      --color-dog-tint: #fde3d6;      --color-dog-photo: #f2cdb4;
  --color-cat: #6d4596;      --color-cat-tint: #efe4fa;      --color-cat-photo: #e3d4f0;
  --color-dragon: #2f6b4f;   --color-dragon-tint: #dff0e2;   --color-dragon-photo: #cfe6d3;

  /* status */
  --color-success: #2f6b4f;
  --color-warning: #9a6200;
  --color-danger: #b42318;

  /* background blobs */
  --color-blob-coral: #f0906a;
  --color-blob-sage: #9cc5a1;
  --color-blob-lilac: #c9b6e4;
  --color-blob-peach: #f7b98b;

  /* type */
  --font-display: var(--font-fraunces), Georgia, serif;
  --font-sans: var(--font-dm-sans), system-ui, sans-serif;

  /* radius */
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;

  /* shadow */
  --shadow-glass: 0 8px 32px rgba(120, 60, 30, 0.10);
  --shadow-glass-lg: 0 12px 40px rgba(120, 60, 30, 0.16);
}
```

Contrast rules: body text uses `ink` or `ink-2`. `ink-3` only for 14px+ captions. White text only on `brand`, `ink`, `dragon` or `cat` fills.

## 2. Typography

| Role | Font | Size (desktop / mobile) | Weight |
| --- | --- | --- | --- |
| Display (hero H1) | Fraunces | 70 / 40px, line-height 1.02 | 700 |
| H1 page title | Fraunces | 52 / 34px | 700 |
| H2 section | Fraunces | 40 to 44 / 28px | 700 |
| H3 card title | Fraunces | 24 to 26px | 700 |
| Body | DM Sans | 17 to 19px, line-height 1.6 | 400 |
| UI / buttons | DM Sans | 15 to 16px | 700 |
| Label / caption | DM Sans | 13 to 14px | 500 to 700 |
| Eyebrow | DM Sans | 13px, uppercase, letter-spacing 1px | 700 |

Load with `next/font/google` (Fraunces with `opsz` axis, DM Sans 400/500/700).

## 3. The glass recipe

One utility, used everywhere. Do not invent new glass values per component.

```css
@utility glass {
  background: rgba(255, 255, 255, 0.50);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.80);
  box-shadow: var(--shadow-glass);
}
@utility glass-strong {
  background: rgba(255, 255, 255, 0.60);
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: var(--shadow-glass-lg);
}
@supports not (backdrop-filter: blur(1px)) {
  .glass, .glass-strong { background: rgba(255, 255, 255, 0.92); }
}
```

Rules:

- Glass only works over colour. Every page has `BlobBackground` behind it.
- Inner blocks inside a glass card use flat `rgba(255,255,255,0.65)` (no second blur, it hurts performance).
- Text on glass is always solid `ink` colours, never semi-transparent.
- Max 3 to 4 blobs per page, `filter: blur(110px)`, opacity 0.45 to 0.55. On mobile use 2 smaller blobs.

## 4. Components

| Component | Spec |
| --- | --- |
| `SiteHeader` | Sticky, `glass`, pill shape (`rounded-full`), logo left, nav centre, heart icon + Donate button right. Mobile: logo + menu button, menu opens a full height glass sheet |
| `Button` primary | `bg-brand text-white`, radius 999px (pill) in marketing, 14px in forms/admin, padding 12px 22px, min height 44px |
| `Button` dark | `bg-ink text-white`, used for "Meet {name}" and Search |
| `Button` outline | 2px `ink` border, transparent |
| `Chip` | Pill, 12px 20px padding. Active = `bg-ink text-white`, inactive = transparent inside a glass group |
| `SpeciesTag` | Pill, 13px bold, species colour on white 80% (on photos) or on species tint (on cards) |
| `PetCard` | `glass`, radius 28px, 12px padding, photo 4:3 radius 20px, species tag top left, heart button top right (44px circle), "Adoption pending" badge bottom left, name (Fraunces 24), meta line, dark button |
| `GlassCard` | `glass`, radius 28 to 32px, padding 28 to 36px |
| `StatCard` (admin) | `glass`, label 14px `ink-3`, number Fraunces 40px |
| `StatusPill` | new = brand tint, in review = cat tint, approved = dragon tint, declined = neutral `#ece7e3` |
| `Stepper` | 5 bars 6px tall, filled `brand` up to current step, label under each |
| Inputs | 14px radius, 1px `rgba(43,33,27,0.15)` border, bg white 75%, 14px 16px padding, bold label above, focus ring 2px `brand` offset 2px |

Icons: `lucide-react`, stroke 1.8 to 2, 18 to 22px. Never emoji.

## 5. Page layouts

Container: max width 1280px, side padding 56px desktop, 16px mobile.

**Home**: header, hero (text left, arched photo right with 2 floating glass badges), quick search glass bar, "Waiting to meet you" 4 card grid, 4 steps inside one large glass panel, 3 care guide cards (one per species), Donate (solid brand) + Foster + Volunteer cards, footer.

**Adopt**: title + count, species chip group top right, filter sidebar (glass, 260px) + 3 column grid. Mobile: chips scroll horizontally, "Filters" button opens bottom sheet, 1 column grid (2 at 640px+).

**Pet profile**: back link, gallery left (main 500px tall + 4 thumbs + "Watch video" chip), glass info card right (tag, name, facts grid, story, personality chips, fee box with Apply button), then Health and "What {name} needs at home" cards.

**Application**: glass form card with stepper + species aware questions, sticky pet summary card on the right (moves above the form on mobile).

**Admin**: glass sidebar 240px, main area with stat cards, applications table, pets strip. Background `cream-admin` with fewer, softer blobs.

## 6. Responsive

| Breakpoint | Pet grid | Notes |
| --- | --- | --- |
| < 640px | 1 col | Hero stacks, photo first, H1 40px |
| 640px+ | 2 cols | |
| 1024px+ | 3 cols (Adopt), 4 cols (Home) | Sidebar filters visible |

Touch targets at least 44px. No horizontal scroll at 375px.

## 7. Motion

- Card hover: lift `translateY(-4px)` and shadow to `glass-lg`, 200ms ease-out
- Page sections fade up 12px on first view (once)
- Heart: small scale pop when saved
- All motion off when `prefers-reduced-motion: reduce`

## 8. Imagery

- Real photos of the actual animals only. No stock photos presented as adoptable pets.
- 4:3 for cards, natural light, animal at eye level.
- Bearded dragons: shoot on a natural background (wood, rock), not on a bare hand.
- Until photos exist, use the species photo colour as a placeholder with the pet name.

## 9. Voice

Warm, short, honest. Talk to one person ("your new friend"). Explain the process and fees clearly. No hype, no urgency tricks ("Only 1 left!"). No em dashes.
