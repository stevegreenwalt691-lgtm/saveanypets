import Link from "next/link";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { AGE_CATEGORIES } from "@/lib/pet-age";
import {
  GOOD_WITH_OPTIONS,
  SORT_OPTIONS,
  buildAdoptHref,
  hasActiveSidebarFilters,
  type AdoptFilters,
} from "@/lib/adopt-filters";

interface AdoptFiltersFormProps {
  filters: AdoptFilters;
}

export function AdoptFiltersForm({ filters }: AdoptFiltersFormProps) {
  return (
    <form action="/adopt" method="get" className="flex flex-col gap-5">
      {filters.species ? <input type="hidden" name="species" value={filters.species} /> : null}

      <Select label="Sort by" name="sort" defaultValue={filters.sort}>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select label="Age" name="age" defaultValue={filters.age ?? ""}>
        <option value="">Any age</option>
        {AGE_CATEGORIES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select label="Size" name="size" defaultValue={filters.size ?? ""}>
        <option value="">Any size</option>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </Select>

      <Select label="Sex" name="sex" defaultValue={filters.sex ?? ""}>
        <option value="">Any sex</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="unknown">Unknown</option>
      </Select>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-bold text-ink">Good with</legend>
        {GOOD_WITH_OPTIONS.map((option) => (
          <Checkbox
            key={option.value}
            name="good_with"
            value={option.value}
            label={option.label}
            defaultChecked={filters.goodWith.includes(option.value)}
          />
        ))}
      </fieldset>

      <Button type="submit" pill={false} className="w-full">
        Apply filters
      </Button>

      {hasActiveSidebarFilters(filters) ? (
        <Link
          href={buildAdoptHref({ species: filters.species })}
          className="text-center text-sm font-bold text-ink-2 underline hover:text-ink"
        >
          Clear filters
        </Link>
      ) : null}
    </form>
  );
}
