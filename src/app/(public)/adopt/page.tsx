import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { parseAdoptFilters, countActiveSidebarFilters, type RawSearchParams } from "@/lib/adopt-filters";
import { getBirthDateRangeForCategory } from "@/lib/pet-age";
import { PET_SUMMARY_COLUMNS, PUBLIC_PET_STATUSES, type PetSummary } from "@/lib/pets";
import { SPECIES } from "@/lib/species";
import { SpeciesChips } from "@/components/pets/SpeciesChips";
import { AdoptFiltersForm } from "@/components/pets/AdoptFiltersForm";
import { MobileFilterSheet } from "@/components/pets/MobileFilterSheet";
import { Pagination } from "@/components/pets/Pagination";
import { PetGrid } from "@/components/pets/PetGrid";

export const metadata: Metadata = {
  title: "Adopt | Save Any Pets",
  description:
    "Browse dogs, cats and bearded dragons waiting for a home. Meet them in person before you adopt.",
};

const PAGE_SIZE = 12;

interface AdoptPageProps {
  searchParams: Promise<RawSearchParams>;
}

export default async function AdoptPage({ searchParams }: AdoptPageProps) {
  const rawParams = await searchParams;
  const filters = parseAdoptFilters(rawParams);

  const supabase = await createClient();
  let query = supabase
    .from("pets")
    .select(PET_SUMMARY_COLUMNS, { count: "exact" })
    .in("status", PUBLIC_PET_STATUSES);

  if (filters.species) query = query.eq("species", filters.species);
  if (filters.size) query = query.eq("size", filters.size);
  if (filters.sex) query = query.eq("sex", filters.sex);

  if (filters.age) {
    const range = getBirthDateRangeForCategory(filters.age);
    if (range.minBirthDate) query = query.gte("birth_date", range.minBirthDate);
    if (range.maxBirthDate) query = query.lte("birth_date", range.maxBirthDate);
  }

  if (filters.goodWith.includes("kids")) query = query.eq("good_with_kids", true);
  if (filters.goodWith.includes("dogs")) query = query.eq("good_with_dogs", true);
  if (filters.goodWith.includes("cats")) query = query.eq("good_with_cats", true);

  switch (filters.sort) {
    case "fee_asc":
      query = query.order("adoption_fee", { ascending: true, nullsFirst: false });
      break;
    case "fee_desc":
      query = query.order("adoption_fee", { ascending: false, nullsFirst: false });
      break;
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("featured", { ascending: false }).order("intake_date", { ascending: false });
  }

  const from = (filters.page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  const pets = (data ?? []) as PetSummary[];
  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const activeCount = countActiveSidebarFilters(filters);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[34px] sm:text-[52px]">Adopt</h1>
          <p className="mt-1 text-ink-2">
            {totalCount} {totalCount === 1 ? "pet" : "pets"} waiting to meet you
            {filters.species ? ` among our ${SPECIES[filters.species].plural.toLowerCase()}` : ""}
          </p>
        </div>
        <SpeciesChips filters={filters} />
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <aside className="hidden shrink-0 lg:block lg:w-[260px]">
          <div className="glass sticky top-24 rounded-[28px] p-6">
            <AdoptFiltersForm filters={filters} />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6">
            <MobileFilterSheet activeCount={activeCount}>
              <AdoptFiltersForm filters={filters} />
            </MobileFilterSheet>
          </div>

          <PetGrid pets={pets} columns={3} />
          <Pagination filters={filters} totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}
