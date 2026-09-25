import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { PUBLIC_PET_STATUSES } from "@/lib/pets";
import { SITE_URL } from "@/lib/site-url";

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/adopt", changeFrequency: "daily", priority: 0.9 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.6 },
  { path: "/care-guides", changeFrequency: "weekly", priority: 0.6 },
  { path: "/success-stories", changeFrequency: "weekly", priority: 0.5 },
  { path: "/get-involved", changeFrequency: "monthly", priority: 0.5 },
  { path: "/surrender", changeFrequency: "monthly", priority: 0.4 },
  { path: "/about", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/adoption-terms", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [petsResult, guidesResult] = await Promise.all([
    supabase.from("pets").select("slug, updated_at").in("status", PUBLIC_PET_STATUSES),
    supabase.from("care_guides").select("slug, updated_at").eq("published", true),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const petEntries: MetadataRoute.Sitemap = (petsResult.data ?? []).map((pet) => ({
    url: `${SITE_URL}/adopt/${pet.slug}`,
    lastModified: pet.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const guideEntries: MetadataRoute.Sitemap = (guidesResult.data ?? []).map((guide) => ({
    url: `${SITE_URL}/care-guides/${guide.slug}`,
    lastModified: guide.updated_at,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...petEntries, ...guideEntries];
}
