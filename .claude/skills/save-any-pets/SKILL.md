---
name: save-any-pets
description: Use when building or changing any page, component, form, database table or admin feature in the Save Any Pets rescue website. Covers the build workflow, design rules, Supabase patterns and the done checklist.
---

# Building a feature in Save Any Pets

Follow these steps in order for every feature. Do not skip the checks at the end.

## Step 1: Load context

1. Read `CLAUDE.md` (stack, rules, trust rules). This is Next.js 16: if unsure about an API, read `node_modules/next/dist/docs/` first.
2. Find the task in `docs/DEVELOPMENT_PLAN.md`. Confirm the phase and what "done" means.
3. If the task touches UI, read the matching section of `docs/DESIGN.md`.
4. If the task touches data, read the matching tables and policies in `docs/DATABASE.md`.
5. Say in one or two lines what you are about to build and which files you will touch. Then build.

## Step 2: Database first (if data changes)

1. Create a migration: `npx supabase migration new short_name`
2. Write SQL. Every new table gets `enable row level security`, a `staff_all` policy and only the public policies it truly needs.
3. Push and regenerate types:

```cmd
npx supabase db push
npx supabase gen types typescript --linked > src\lib\supabase\database.types.ts
```

4. Update `docs/DATABASE.md` with the new table or policy.

Never edit a migration that has already been pushed. Write a new one.

## Step 3: Data access patterns

**Reading (Server Component)**

```ts
import { createClient } from "@/lib/supabase/server";

export default async function AdoptPage({ searchParams }: { searchParams: Promise<{ species?: string }> }) {
  const { species } = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("pets")
    .select("id, slug, name, species, sex, size, birth_date, status, pet_photos(path, alt, is_primary)")
    .in("status", ["available", "pending"])
    .order("featured", { ascending: false })
    .order("intake_date", { ascending: false });
  if (species) query = query.eq("species", species);
  const { data: pets, error } = await query;
  if (error) throw error;
  // render
}
```

**Writing (Server Action)**

```ts
"use server";
import { applicationSchema } from "@/lib/validation/application";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";

export async function submitApplication(input: unknown) {
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  if (!(await verifyTurnstile(parsed.data.turnstileToken))) return { ok: false, errors: { form: ["Please try again."] } };
  const supabase = await createClient();
  const { error } = await supabase.from("applications").insert(toRow(parsed.data)); // no .select() for public inserts
  if (error) return { ok: false, errors: { form: ["Something went wrong. Please try again."] } };
  return { ok: true };
}
```

Admin actions also call `revalidatePath` for the public pages they affect (for example `/adopt` and `/adopt/[slug]`).

Rules:

- Server Components read. Server Actions write. Client Components only hold UI state.
- Always validate with zod on the server, even if the client validated too.
- Never import the service role key into app code.
- Filters and search go in URL params.

## Step 4: Build the UI

1. Reuse components from `src/components/ui` first: `GlassCard`, `Button`, `Chip`, `SpeciesTag`, `Input`, `Select`, `Stepper`, `StatusPill`. Add a new one only if nothing fits, and add it to `/styleguide`.
2. Use the design tokens (`bg-brand`, `text-ink-2`, `glass`, `rounded-[28px]`). No random hex values in components.
3. Every page sits on `BlobBackground` so glass has colour behind it.
4. Species colours come from one map in `src/lib/species.ts`:

```ts
export const SPECIES = {
  dog: { label: "Dog", plural: "Dogs", color: "text-dog", tint: "bg-dog-tint", photo: "bg-dog-photo" },
  cat: { label: "Cat", plural: "Cats", color: "text-cat", tint: "bg-cat-tint", photo: "bg-cat-photo" },
  bearded_dragon: { label: "Bearded Dragon", plural: "Bearded Dragons", color: "text-dragon", tint: "bg-dragon-tint", photo: "bg-dragon-photo" },
} as const;
```

5. Species aware content: when a feature differs by species (care needs, form questions, guides), branch on `pet.species` in one place, not scattered `if` checks.
6. Mobile first. Check 375px before 1280px.
7. Real HTML: `<button>` for actions, `<a>`/`<Link>` for navigation, `<label>` on every input, `aria-label` on icon-only buttons.

## Step 5: Copy

- Warm, short, plain language. One idea per sentence.
- **No em dashes.** Use a comma, colon or full stop.
- Never write fake testimonials, fake stats or urgency tricks. Use `[PLACEHOLDER]` until the client sends real content.
- Fees and "no payment before meet-and-greet" must be visible wherever adopting is mentioned.

## Step 6: Done checklist

Run these and fix anything that fails:

```cmd
npm run lint
npm run typecheck
npm run check:copy
npm run build
```

Then confirm:

- [ ] Works at 375px, 768px, 1280px
- [ ] Keyboard only: can reach and use everything, focus ring visible
- [ ] Loading, empty and error states exist
- [ ] RLS: anon cannot read or change private data (test in the SQL editor as anon)
- [ ] Admin changes show on the public site (revalidation works)
- [ ] Task ticked in `docs/DEVELOPMENT_PLAN.md`, docs updated if behaviour changed

## Step 7: Hand back

- Summarise what changed in 2 or 3 lines and list the files.
- Give full file contents for any file the developer asks to see, not diffs.
- Give commands in Windows CMD syntax only.
- Suggest a commit message (no em dashes), for example `feat(adopt): species filter chips and URL params`.
