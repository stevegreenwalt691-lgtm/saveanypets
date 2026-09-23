@AGENTS.md

# Save Any Pets: project guide for Claude Code

Read this file first in every session. It is the source of truth for how this project is built.

## What we are building

Save Any Pets is a rescue and rehoming website for **dogs, cats and bearded dragons**.

- The public can browse pets, save favourites, read care guides and apply to adopt.
- Staff use a private admin panel to manage pets, review applications and publish content.
- The site must look trustworthy and **be** trustworthy (see "Trust rules" below).

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript (strict). Next 16 differs from older versions: check `node_modules/next/dist/docs/` before using an API you are unsure of |
| Styling | Tailwind CSS v4, tokens in `src/app/globals.css` (see `docs/DESIGN.md`) |
| Database, auth, files | Supabase (Postgres, Auth, Storage, Row Level Security) |
| Supabase client | `@supabase/ssr` + `@supabase/supabase-js` |
| Forms and validation | `react-hook-form` + `zod` |
| Icons | `lucide-react` (never emoji) |
| Animation | `motion` (Framer Motion), used lightly |
| Email | Resend (application received / approved emails) |
| Hosting | Vercel (preview deploy per branch, production on `main`) |
| Anti spam | Cloudflare Turnstile on public forms + honeypot field |

## Other docs (read the one that matches your task)

- `docs/DEVELOPMENT_PLAN.md`: phases, tasks and what "done" means for each
- `docs/DESIGN.md`: colours, type, the glass recipe, components, page layouts
- `docs/DATABASE.md`: tables, enums, RLS policies, storage buckets, seed data
- `.claude/skills/save-any-pets/SKILL.md`: the step by step workflow for building any feature

## Commands (Windows CMD only)

```cmd
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
npm run check:copy
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase migration new add_pets_table
npx supabase db push
npx supabase gen types typescript --linked > src\lib\supabase\database.types.ts
npx vercel link
npx vercel env pull .env.local
```

Never give PowerShell or bash syntax in this project. Use `\` in local paths, `set VAR=value` for env vars.

## Folder structure

```
src/
  app/
    (public)/            public site: home, adopt, care-guides, stories, get-involved, about, contact
    admin/               staff panel (protected by `src/proxy.ts`)
    api/                 route handlers only when a server action will not do (webhooks)
    globals.css          design tokens + base styles
  components/
    ui/                  GlassCard, Button, Chip, SpeciesTag, Input, Select, Stepper, Badge
    pets/                PetCard, PetGrid, PetFilters, PetGallery, FavoriteButton
    forms/               ApplicationForm steps, VolunteerForm, SurrenderForm
    admin/               AdminSidebar, StatCard, DataTable, StatusPill, PhotoUploader
    layout/              SiteHeader, SiteFooter, BlobBackground
  lib/
    supabase/            server.ts, client.ts, proxy.ts (session helper), database.types.ts
    validation/          zod schemas (one file per form)
    actions/             server actions grouped by feature
    utils.ts
supabase/
  migrations/            SQL, one file per change, never edit an applied migration
  seed.sql               sample pets for local and preview
docs/
```

## Coding rules

1. **Server first.** Pages are Server Components that read from Supabase on the server. Use a Client Component only for interactivity (filters, favourites, forms, uploads).
2. **Mutations go through server actions** in `src/lib/actions/`, validated with the matching zod schema. Never trust the client.
3. **RLS is the real security.** Every table has RLS enabled. The anon key is public. Admin checks happen in the database (`is_staff()`), not only in the UI.
4. **Never expose `SUPABASE_SERVICE_ROLE_KEY`** to the browser. It is only for scripts and webhooks, and should rarely be needed.
5. **Types come from Supabase.** Regenerate `database.types.ts` after every migration.
6. **Filters live in the URL** (`/adopt?species=cat&age=young`) so results are shareable and work with the back button.
7. **Images** use `next/image` with Supabase Storage URLs. Always set `alt` (for example "Spike, a 3 year old bearded dragon").
8. **Full file replacements** when handing code back to the developer, not partial diffs.
9. Keep components small. If a file passes about 200 lines, split it.
10. Use Steve Greenwalt / stevegreenwalt691@gmail.com for any owner, author, test or contact details. Never use any other personal name.

## Copy and content rules

- **Never use em dashes** anywhere: UI copy, code comments, docs, commit messages. Use a comma, colon, full stop or brackets. `npm run check:copy` fails the build if one sneaks in.
- Plain, warm, short sentences. Say "Apply to adopt", not "Submit adoption inquiry".
- Species names are always "Dog", "Cat", "Bearded Dragon" (capitalised in tags, lower case in sentences).
- No lorem ipsum in anything that ships. Use `[PLACEHOLDER]` style tokens until the client sends real content.

## Trust rules (non negotiable)

Pet scam sites copy the look of real rescues. We must be clearly different.

- **No payment before a meet-and-greet.** The adoption fee is paid in person or after staff approve and the adopter has met the pet.
- **No shipping or "delivery" of animals.** Adoption is local pickup only.
- **Fees are shown upfront** on every pet profile. No surprise "insurance", "crate" or "vaccination" fees later.
- **Reviews and success stories are real**, entered by staff with the adopter's consent. Never generate fake testimonials.
- **Real contact details** (address, phone, registration number) in the footer and on the contact page.
- No crypto, gift card or "send to agent" payment methods.

## Definition of done (every task)

- `npm run lint`, `npm run typecheck`, `npm run build` all pass
- Works at 375px, 768px and 1280px wide
- Keyboard usable, visible focus rings, text contrast at least 4.5:1
- RLS tested: an anonymous user cannot read or change what they should not
- No em dashes (`npm run check:copy`)
- Relevant doc in `docs/` updated if behaviour changed
- Never use the browser or claude-in-chrome to test unless the user explicitly asks in that message. Verify with lint, typecheck, check:copy and build only. When done, give a short list of manual test steps and stop. Never restart the dev server unless asked.
