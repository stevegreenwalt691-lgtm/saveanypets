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
| Later | Donations, alerts, extras | as needed |

Total MVP: about 4 weeks of focused work.

---

## Phase 0: Project setup

**Tasks**

- [x] Scaffold Next.js 16 app (TypeScript, Tailwind, ESLint, App Router, `src/`)
- [x] Add `CLAUDE.md`, `docs/`, `.claude/skills/`, `scripts/`
- [x] Add dependencies and `typecheck` / `check:copy` scripts to `package.json`
- [ ] `npm install` on your machine, then `npm run dev`
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

- [ ] Tokens in `globals.css` (`@theme` block): colours, radii, shadows, fonts (Fraunces + DM Sans via `next/font`)
- [ ] `BlobBackground` (fixed, blurred colour blobs, respects `prefers-reduced-motion`)
- [ ] UI kit: `GlassCard`, `Button` (primary, dark, outline, ghost), `Chip`, `SpeciesTag`, `Input`, `Select`, `Textarea`, `Checkbox`, `Stepper`, `StatusPill`
- [ ] `SiteHeader` (sticky glass pill nav, mobile sheet menu), `SiteFooter`
- [ ] A hidden `/styleguide` page showing every component (delete or protect before launch)

**Done when:** the style guide matches the prototype on desktop and mobile.

---

## Phase 2: Database, auth and seed data

Follow `docs/DATABASE.md`.

- [ ] Migrations: enums, `profiles`, `pets`, `pet_photos`, `applications`, `meet_slots`, `care_guides`, `success_stories`, `people_signups`, `surrenders`, `site_settings`
- [ ] `is_staff()` helper and RLS policies on every table
- [ ] Storage buckets: `pet-photos` (public read), `story-photos` (public read), staff write only
- [ ] Trigger: `updated_at` on update; trigger to set pet status to `pending` when an application is approved
- [ ] `seed.sql` with 9 sample pets (3 per species)
- [ ] Generate types
- [ ] Supabase Auth: email + password for staff only, public sign-up disabled
- [ ] `src/proxy.ts` (Next 16 name for middleware) refreshes the session and blocks `/admin/*` unless logged in and `is_staff()`

**Done when:** staff can log in, anon cannot read applications (tested in SQL editor and from the browser).

---

## Phase 3: Browse pets and pet profiles

- [ ] `/` Home: hero, quick search (species + age, submits to `/adopt`), 4 featured pets, steps, care guide cards, get involved cards
- [ ] `/adopt`: species chips, filter sidebar (age, size, sex, good with), sort, pagination (12 per page), empty state; filters stored in URL params
- [ ] `/adopt/[slug]`: gallery with thumbnails, facts grid, personality tags, health checklist, "what they need at home" (species specific), fee box, Apply button, status banner if pending
- [ ] Favourites: heart on each card saved in `localStorage`, `/favorites` page
- [ ] Mobile: filters open in a bottom sheet

**Done when:** a visitor can filter to "Bearded Dragons, young" and open a profile, all from real Supabase data.

---

## Phase 4: Adoption application

- [ ] `/adopt/[slug]/apply`: 5 step form (About you, Home, Experience, Meet-and-greet, Review)
- [ ] Species aware questions: reptile experience and UVB setup only for bearded dragons; yard and other dogs for dogs
- [ ] Progress kept in `sessionStorage` so a refresh does not lose answers
- [ ] Meet-and-greet slot picker from `meet_slots` (only open, future, not full)
- [ ] Server action: zod validate, verify Turnstile, insert application, email applicant and staff via Resend
- [ ] Success page with what happens next and expected reply time
- [ ] Block applying for `adopted` pets; warn (but allow a backup application) for `pending`

**Done when:** an application submitted on the live preview shows up for staff and both emails arrive.

---

## Phase 5: Admin panel

- [ ] `/admin/login`
- [ ] `/admin` dashboard: stat cards (available, pending, open applications, adopted this month), newest applications, today's meet-and-greets
- [ ] `/admin/pets`: table with search and status filter; create and edit form; drag to reorder photos; set primary photo; mark featured; change status
- [ ] `/admin/applications`: list with status tabs; detail page with all answers, staff notes, Approve / Decline / Mark completed (sends email, updates pet status)
- [ ] `/admin/meet-greets`: manage slots (create a week of slots at once), see bookings
- [ ] `/admin/stories` and `/admin/guides`: create, edit, publish toggle, markdown body with preview
- [ ] `/admin/people`: foster, volunteer and surrender submissions with CSV export
- [ ] `/admin/settings`: shelter name, contact details, fees per species, opening hours (from `site_settings`)
- [ ] Roles: `admin` can manage staff and settings, `staff` can do everything else

**Done when:** the client can add a new pet with photos and approve an application without touching code.

---

## Phase 6: Content pages

- [ ] `/how-it-works`: steps, fees table per species, what the fee covers, FAQs
- [ ] `/care-guides` and `/care-guides/[slug]`: filter by species
- [ ] `/success-stories`
- [ ] `/get-involved`: foster and volunteer forms, donate section (bank details or Paystack link for now)
- [ ] `/surrender`: rehoming form for owners
- [ ] `/about` and `/contact` (map embed, WhatsApp button, hours, registration number)
- [ ] `/privacy` and `/adoption-terms`

---

## Phase 7: Polish

- [ ] SEO: `generateMetadata` per page, per pet Open Graph image (`opengraph-image.tsx`), `sitemap.ts`, `robots.ts`, JSON-LD for the organisation
- [ ] Speed: `next/image` sizes, Supabase image transforms, ISR (`revalidate`) on public pages, `revalidatePath` after admin edits
- [ ] Accessibility pass: keyboard, focus, labels, contrast, reduced motion, glass fallback when `backdrop-filter` is not supported
- [ ] Vercel Analytics and Speed Insights
- [ ] Error and loading states (`error.tsx`, `loading.tsx`, `not-found.tsx`)
- [ ] Lighthouse target: 90+ on all four scores for Home, Adopt, Pet profile

---

## Phase 8: Launch and handover

- [ ] Connect the client domain on Vercel, force HTTPS
- [ ] Supabase: enable Point in Time Recovery or daily backups on the paid plan, set auth email templates, SMTP via Resend
- [ ] Remove seed pets, add the client's real pets
- [ ] Create staff accounts, walk the client through the admin panel
- [ ] Short handover doc: how to add a pet, review an application, publish a story
- [ ] Monitor for one week: form spam, errors in Vercel logs

---

## Later (after MVP)

- Online donations with Paystack (webhook to `donations` table)
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
