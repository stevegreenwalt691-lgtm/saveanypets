import type { Species } from "@/lib/species";
import type { AgeCategory } from "@/lib/pet-age";
import type { Database } from "@/lib/supabase/database.types";

export type PetSizeFilter = Database["public"]["Enums"]["pet_size"];
export type PetSexFilter = Database["public"]["Enums"]["pet_sex"];
export type GoodWith = "kids" | "dogs" | "cats";
export type SortOption = "newest" | "fee_asc" | "fee_desc" | "name_asc";

export interface AdoptFilters {
  species?: Species;
  age?: AgeCategory;
  size?: PetSizeFilter;
  sex?: PetSexFilter;
  goodWith: GoodWith[];
  sort: SortOption;
  page: number;
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest arrivals" },
  { value: "fee_asc", label: "Adoption fee: low to high" },
  { value: "fee_desc", label: "Adoption fee: high to low" },
  { value: "name_asc", label: "Name: A to Z" },
];

export const GOOD_WITH_OPTIONS: { value: GoodWith; label: string }[] = [
  { value: "kids", label: "Good with kids" },
  { value: "dogs", label: "Good with dogs" },
  { value: "cats", label: "Good with cats" },
];

const SPECIES_VALUES: Species[] = ["dog", "cat", "bearded_dragon"];
const AGE_VALUES: AgeCategory[] = ["baby", "young", "adult", "senior"];
const SIZE_VALUES: PetSizeFilter[] = ["small", "medium", "large"];
const SEX_VALUES: PetSexFilter[] = ["male", "female", "unknown"];
const SORT_VALUES: SortOption[] = SORT_OPTIONS.map((option) => option.value);
const GOOD_WITH_VALUES: GoodWith[] = GOOD_WITH_OPTIONS.map((option) => option.value);

export type RawSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function oneOf<T extends string>(value: string | undefined, allowed: T[]): T | undefined {
  return allowed.includes(value as T) ? (value as T) : undefined;
}

export function parseAdoptFilters(searchParams: RawSearchParams): AdoptFilters {
  const page = Number(firstValue(searchParams.page));

  return {
    species: oneOf(firstValue(searchParams.species), SPECIES_VALUES),
    age: oneOf(firstValue(searchParams.age), AGE_VALUES),
    size: oneOf(firstValue(searchParams.size), SIZE_VALUES),
    sex: oneOf(firstValue(searchParams.sex), SEX_VALUES),
    sort: oneOf(firstValue(searchParams.sort), SORT_VALUES) ?? "newest",
    goodWith: toArray(searchParams.good_with).filter((value): value is GoodWith =>
      GOOD_WITH_VALUES.includes(value as GoodWith),
    ),
    page: Number.isFinite(page) && page > 1 ? Math.floor(page) : 1,
  };
}

/** Builds an /adopt href from a set of filters. Pure and usable on the server or client. */
export function buildAdoptHref(filters: Partial<AdoptFilters>): string {
  const params = new URLSearchParams();

  if (filters.species) params.set("species", filters.species);
  if (filters.age) params.set("age", filters.age);
  if (filters.size) params.set("size", filters.size);
  if (filters.sex) params.set("sex", filters.sex);
  filters.goodWith?.forEach((value) => params.append("good_with", value));
  if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));

  const query = params.toString();
  return query ? `/adopt?${query}` : "/adopt";
}

export function countActiveSidebarFilters(filters: AdoptFilters): number {
  return [filters.age, filters.size, filters.sex].filter(Boolean).length + filters.goodWith.length;
}

export function hasActiveSidebarFilters(filters: AdoptFilters): boolean {
  return countActiveSidebarFilters(filters) > 0;
}
