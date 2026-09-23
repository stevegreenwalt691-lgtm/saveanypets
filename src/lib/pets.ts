import type { Database } from "@/lib/supabase/database.types";

export type PetRow = Database["public"]["Tables"]["pets"]["Row"];

export type PetPhotoSummary = Pick<
  Database["public"]["Tables"]["pet_photos"]["Row"],
  "id" | "path" | "alt" | "is_primary" | "sort_order"
>;

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
> & {
  pet_photos: PetPhotoSummary[];
};

export const PET_SUMMARY_COLUMNS =
  "id, slug, name, species, sex, size, birth_date, status, adoption_fee, featured, pet_photos(id, path, alt, is_primary, sort_order)" as const;

export const PUBLIC_PET_STATUSES = ["available", "pending", "on_hold"] as const;

export const PET_STATUSES = ["draft", "available", "pending", "adopted", "on_hold"] as const;

const PET_STATUS_LABELS: Record<PetRow["status"], string> = {
  draft: "Draft",
  available: "Available",
  pending: "Pending",
  adopted: "Adopted",
  on_hold: "On hold",
};

export function formatPetStatus(status: PetRow["status"]): string {
  return PET_STATUS_LABELS[status];
}

/** The photo marked primary, or the first by sort order, or null if the pet has none. */
export function getPrimaryPhoto(photos: PetPhotoSummary[]): PetPhotoSummary | null {
  if (photos.length === 0) return null;
  return photos.find((photo) => photo.is_primary) ?? [...photos].sort((a, b) => a.sort_order - b.sort_order)[0];
}

/** Public URL for a file in the pet-photos bucket. The bucket is public, no signing needed. */
export function getPetPhotoUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-photos/${path}`;
}

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
