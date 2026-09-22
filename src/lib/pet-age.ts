export type AgeCategory = "baby" | "young" | "adult" | "senior";

export const AGE_CATEGORIES: { value: AgeCategory; label: string }[] = [
  { value: "baby", label: "Baby, under 1 year" },
  { value: "young", label: "Young, 1 to 3 years" },
  { value: "adult", label: "Adult, 3 to 8 years" },
  { value: "senior", label: "Senior, 8 years and up" },
];

function monthsBetween(birthDate: Date, today: Date) {
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
  months += today.getMonth() - birthDate.getMonth();
  if (today.getDate() < birthDate.getDate()) months -= 1;
  return Math.max(months, 0);
}

/** Age category for a pet, or null if birth_date is not known. */
export function getAgeCategory(birthDate: string | null): AgeCategory | null {
  if (!birthDate) return null;
  const months = monthsBetween(new Date(birthDate), new Date());
  if (months < 12) return "baby";
  if (months < 36) return "young";
  if (months < 96) return "adult";
  return "senior";
}

/** Human readable age, e.g. "2 years old" or "5 months old". */
export function getAgeLabel(birthDate: string | null): string {
  if (!birthDate) return "Age unknown";
  const months = monthsBetween(new Date(birthDate), new Date());

  if (months < 1) return "Under 1 month old";
  if (months < 12) return months === 1 ? "1 month old" : `${months} months old`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return years === 1 ? "1 year old" : `${years} years old`;
  return `${years} yr ${remainingMonths} mo old`;
}

/**
 * The birth_date bounds that match an age category, for filtering in a
 * Supabase query with .gte() / .lte() on birth_date.
 */
export function getBirthDateRangeForCategory(category: AgeCategory, today = new Date()) {
  const toISODate = (date: Date) => date.toISOString().slice(0, 10);
  const yearsAgo = (years: number) =>
    toISODate(new Date(today.getFullYear() - years, today.getMonth(), today.getDate()));

  switch (category) {
    case "baby":
      return { minBirthDate: yearsAgo(1) };
    case "young":
      return { minBirthDate: yearsAgo(3), maxBirthDate: yearsAgo(1) };
    case "adult":
      return { minBirthDate: yearsAgo(8), maxBirthDate: yearsAgo(3) };
    case "senior":
      return { maxBirthDate: yearsAgo(8) };
  }
}
