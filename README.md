# Save Any Pets

Rescue and rehoming website for dogs, cats and bearded dragons.
Next.js 16 + Supabase + Vercel, built with Claude Code.

## What is in this folder

| File | Purpose |
| --- | --- |
| `CLAUDE.md` | Project rules Claude Code reads every session |
| `AGENTS.md` | Next.js 16 notes for AI agents (created by Next, keep it) |
| `docs/DEVELOPMENT_PLAN.md` | Phases, tasks, checklists |
| `docs/DESIGN.md` | Colours, fonts, glass recipe, components, layouts |
| `docs/DATABASE.md` | Supabase tables, RLS policies, storage |
| `.claude/skills/save-any-pets/SKILL.md` | Step by step workflow Claude Code follows for each feature |
| `scripts/check-copy.mjs` | Fails if an em dash is found in `src` or `docs` |
| `.env.example` | Env vars to copy into `.env.local` |

## Setup (Windows CMD)

```cmd
cd C:\Users\YourName\saveanypets
npm install
copy .env.example .env.local
npm run dev
```

Open http://localhost:3000. Fill `.env.local` once your Supabase project exists.

## Supabase

```cmd
npx supabase login
npx supabase init
npx supabase link --project-ref YOUR_PROJECT_REF
```

## Git and Vercel

```cmd
git init
git add .
git commit -m "chore: scaffold Save Any Pets"
git branch -M main
git remote add origin https://github.com/stevegreenwalt691-lgtm/saveanypets.git
git push -u origin main
npx vercel link
```

Every branch gets a preview URL, `main` goes to production.

## First prompt for Claude Code

```
Read CLAUDE.md and docs/DEVELOPMENT_PLAN.md. Phase 0 is mostly done. Finish Phase 0, then start Phase 1. Use the save-any-pets skill.
```
