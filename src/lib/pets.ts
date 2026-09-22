import type { Database } from "@/lib/supabase/database.types";

export type PetRow = Database["public"]["Tables"]["pets"]["Row"];

export type PetSummary = Pick<
  PetRow,
  | "id"
  | "slug"
  | "name"
  | "species"
  | "sex"
  | "size"
  | "birth_date"
  | "status"
  | "adoption_fee"
  | "featured"
>;

export const PET_SUMMARY_COLUMNS =
  "id, slug, name, species, sex, size, birth_date, status, adoption_fee, featured" as const;

export const PUBLIC_PET_STATUSES = ["available", "pending", "on_hold"] as const;

export function formatFee(fee: number | null): string {
  if (fee === null) return "Fee not yet set";
  if (fee === 0) return "No fee";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(fee);
}

const SEX_LABELS: Record<PetRow["sex"], string> = {
  male: "Male",
  female: "Female",
  unknown: "Sex unknown",
};

export function formatSex(sex: PetRow["sex"]): string {
  return SEX_LABELS[sex];
}

const SIZE_LABELS: Record<NonNullable<PetRow["size"]>, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

export function formatSize(size: PetRow["size"]): string | null {
  return size ? SIZE_LABELS[size] : null;
}
