# Save Any Pets: development plan

Stack: Next.js + TypeScript + Tailwind on **Vercel**, **Supabase** for database, auth and photos, built with **Claude Code**.

Work one phase at a time. Each phase ends with a Vercel preview deploy the client can click through.

## Overview

| Phase | Goal | Rough time (solo) |
| --- | --- | --- |
| 0 | Project setup | 1 day |
| 1 | Design system and layout | 2 to 3 days |
| 2 | Database, auth and seed data | 2 days |
| 3 | Browse pets and pet profiles | 3 days |
| 4 | Adoption application | 3 days |
| 5 | Admin panel | 4 to 5 days |
| 6 | Content pages | 3 days |
| 7 | Polish: SEO, speed, accessibility | 2 days |
| 8 | Launch and handover | 1 to 2 days |
| Later | Alerts and extras | as needed |

Total MVP: about 4 weeks of focused work.

---

## Phase 0: Project setup

**Tasks**

- [x] Scaffold Next.js 16 app (TypeScript, Tailwind, ESLint, App Router, `src/`)
- [x] Add `CLAUDE.md`, `docs/`, `.claude/skills/`, `scripts/`
- [x] Add dependencies and `typecheck` / `check:copy` scripts to `package.json`
- [x] `npm install` on your machine, then `npm run dev`
- [ ] Create GitHub repo `saveanypets` and push
- [ ] Create Supabase project (region closest to users), note URL and anon key
- [ ] `npx supabase init` and `npx supabase link --project-ref YOUR_PROJECT_REF`
- [ ] Create Vercel project from the repo, add env vars, confirm first deploy

**Env vars** (copy `.env.example` to `.env.local`, and add the same in Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=
```

**Done when:** the empty app deploys on Vercel and `npm run build` passes.

---

## Phase 1: Design system and layout

Build from `docs/DESIGN.md` and the "Glass UI" prototype.

- [x] Tokens in `globals.css` (`@theme` block): colours, radii, shadows, fonts (Fraunces + DM Sans via `next/font`)
- [x] `BlobBackground` (fixed, blurred colour blobs, respects `prefers-reduced-motion`)
- [x] UI kit: `GlassCard`, `Button` (primary, dark, outline, ghost), `Chip`, `SpeciesTag`, `Input`, `Select`, `Textarea`, `Checkbox`, `Stepper`, `StatusPill`
- [x] `SiteHeader` (sticky glass pill nav, mobile sheet menu), `SiteFooter`
- [x] A hidden `/styleguide` page showing every component (delete or protect before launch)

**Done when:** the style guide matches the prototype on desktop and mobile.

---

## Phase 2: Database, auth and seed data

Follow `docs/DATABASE.md`.

- [x] Migrations: enums, `profiles`, `pets`, `pet_photos`, `applications`, `meet_slots`, `care_guides`, `success_stories`, `people_signups`, `surrenders`, `site_settings`
- [x] `is_staff()` helper and RLS policies on every table
- [x] Storage buckets: `pet-photos` (public read), `story-photos` (public read), staff write only
- [x] Trigger: `updated_at` on update; trigger to set pet status to `pending` when an application is approved
- [x] `seed.sql` with 9 sample pets (3 per species) and a week of `meet_slots`
- [x] Generate types
- [x] Supabase Auth: email + password for staff only, public sign-up disabled
- [x] `src/proxy.ts` (Next 16 name for middleware) refreshes the session and blocks `/admin/*` unless logged in and `is_staff()`

**Done when:** staff can log in, anon cannot read applications (tested in SQL editor and from the browser).

---

## Phase 3: Browse pets and pet profiles

- [x] `/` Home: hero, quick search (species + age, submits to `/adopt`), 4 featured pets, steps, care guide cards, get involved cards
- [x] `/adopt`: species chips, filter sidebar (age, size, sex, good with), sort, pagination (12 per page), empty state; filters stored in URL params
- [x] `/adopt/[slug]`: gallery placeholder (no real photos yet), facts grid, personality tags, health checklist, "what they need at home" (species specific), fee box, Apply button, status banner if pending
- [x] Favourites: heart on each card saved in `localStorage`, `/favorites` page
- [x] Mobile: filters open in a bottom sheet

**Done when:** a visitor can filter to "Bearded Dragons, young" and open a profile, all from real Supabase data.

---

## Phase 4: Adoption application

- [x] `/adopt/[slug]/apply`: 5 step form (About you, Home, Experience, Meet-and-greet, Review)
- [x] Species aware questions: reptile experience and UVB setup only for bearded dragons; yard and other dogs for dogs
- [x] Progress kept in `sessionStorage` so a refresh does not lose answers
- [x] Meet-and-greet slot picker from `meet_slots` (only open, future, not full)
- [x] Server action: zod validate, verify Turnstile, insert application, email applicant and staff via Resend
- [x] Success page with what happens next and expected reply time
- [x] Block applying for `adopted` pets; warn (but allow a backup application) for `pending`

**Done when:** an application submitted on the live preview shows up for staff and both emails arrive.

---

## Phase 5: Admin panel

- [x] `/admin/login`
- [x] `/admin` dashboard: stat cards (available, pending, open applications, adopted this month), newest applications, today's meet-and-greets
- [x] `/admin/pets`: table with search and status filter; create and edit form; reorder photos with up/down buttons (no drag library); set primary photo; mark featured; change status
- [x] `/admin/applications`: list with status tabs and counts; detail page with all answers grouped like the form, staff notes (save on blur), Mark in review / Approve / Decline / Mark completed (sends email; the `applications_sync_pet` trigger updates pet status, the action never touches `pets` directly)
- [x] `/admin/meet-greets`: upcoming slots with who booked each, open or close a slot, "Create slots" form (date range, times, capacity) to create many at once
- [x] `/admin/stories` and `/admin/guides`: create, edit, publish toggle, markdown body with preview
- [x] `/admin/people`: foster, volunteer and surrender submissions with CSV export
- [x] `/admin/settings`: shelter name, contact details, fees per species, opening hours, donation details (from `site_settings`, admin only)
- [ ] Roles: `admin` can manage staff and settings, `staff` can do everything else

**Done when:** the client can add a new pet with photos and approve an application without touching code.

---

## Phase 6: Content pages

- [x] `/how-it-works`: steps, fees table per species, what the fee covers, FAQs
- [x] `/care-guides` and `/care-guides/[slug]`: filter by species, `react-markdown` for `body_md`
- [x] `/success-stories`
- [x] `/get-involved`: foster and volunteer forms, donate section (bank transfer details from `site_settings`, no online payment)
- [x] `/surrender`: rehoming form for owners
- [x] `/about` and `/contact` (map embed, WhatsApp button, hours, registration number)
- [x] `/privacy` and `/adoption-terms`
- [x] `/admin/settings`: shelter details, fees, opening hours, donation details (admin only)

**Sitemap plan** (for `sitemap.ts` in Phase 7): `/`, `/adopt`, `/adopt/[slug]` (one per public pet),
`/how-it-works`, `/care-guides`, `/care-guides/[slug]` (one per published guide), `/success-stories`,
`/get-involved`, `/surrender`, `/about`, `/contact`, `/privacy`, `/adoption-terms`. Leave out
`/favorites`, everything under `/admin`, `/admin/login` and `/styleguide`.

---

## Phase 7: Polish

- [x] SEO: `generateMetadata` per page (dynamic pages read real data, static pages have real titles and descriptions), per pet Open Graph image (`opengraph-image.tsx`, photo or species colour fallback), `sitemap.ts` and `robots.ts` from the sitemap plan below, JSON-LD (`AnimalShelter`) for the organisation on the home page
- [x] `next/image` `sizes` corrected in `PetCard` (grid column aware), `PetGallery` and the admin `PhotoManager`
- [ ] Speed: Supabase image transforms, ISR (`revalidate`) on public pages, `revalidatePath` after admin edits
- [x] Accessibility pass: keyboard reachability, focus rings (including the meet-and-greet slot picker), labels, contrast, glass fallback when `backdrop-filter` is not supported (confirmed working)
- [x] Vercel Analytics and Speed Insights
- [x] Error and loading states (`error.tsx`, `loading.tsx`, `not-found.tsx`) at the app root and for `/adopt/[slug]` and `/care-guides/[slug]`
- [ ] Lighthouse target: 90+ on all four scores for Home, Adopt, Pet profile

---

## Phase 8: Launch and handover

- [x] `NEXT_PUBLIC_SITE_URL` (via `src/lib/site-url.ts`) confirmed as the only source for the site's own URL in `sitemap.ts`, `robots.ts`, the organisation JSON-LD, the pet Open Graph image (via `metadataBase`) and the staff notification emails, no hardcoded domain anywhere
- [x] `src/proxy.ts` confirmed: redirects to `/admin/login` for anyone not signed in or not `is_staff()` on every `/admin/*` route; `/styleguide` now returns a 404 when `VERCEL_ENV=production` (still visible in dev and previews)
- [x] Turnstile and a honeypot field confirmed on every public form (applications, foster/volunteer, surrender), both checked on the server before anything is saved
- [x] `supabase/remove-seed-data.sql` written: removes the 9 sample pets (and any test applications against them), not run automatically, run it yourself once against production
- [ ] Connect the client domain on Vercel, force HTTPS
- [ ] Supabase: enable Point in Time Recovery or daily backups on the paid plan, set auth email templates, SMTP via Resend
- [ ] Run `supabase/remove-seed-data.sql` against production, add the client's real pets, review the 3 starter care guides
- [ ] Create staff accounts in Supabase Auth (with a `profiles` row for each), walk the client through the admin panel
- [x] Handover doc (`docs/HANDOVER.md`): logging in, adding a pet with photos, reviewing and approving an application, creating meet-and-greet slots, publishing a success story or care guide, updating site settings
- [ ] Monitor for one week: form spam, errors in Vercel logs

---

## Later (after MVP)

No online donations, ever. Donations are bank transfer only, shown on `/get-involved`.

- New arrival alerts by email or WhatsApp for saved searches
- "Which pet suits me?" quiz
- Sponsor a pet (monthly)
- Foster portal where fosters update their pet's profile
- Multi language, if the client needs it

## Working with Claude Code

- Start each session with: "Read CLAUDE.md and docs/DEVELOPMENT_PLAN.md. We are on Phase X, task Y."
- One task per prompt, then review, run the app, commit.
- After a migration: regenerate types before writing code that uses them.
- Tick boxes in this file as tasks finish so the next session knows where we are.
