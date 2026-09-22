import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { SPECIES } from "@/lib/species";
import { AGE_CATEGORIES } from "@/lib/pet-age";

export function QuickSearchBar() {
  return (
    <form
      action="/adopt"
      method="get"
      className="glass flex flex-col gap-4 rounded-[28px] p-5 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <Select label="Species" name="species" defaultValue="">
          <option value="">Any species</option>
          <option value="dog">{SPECIES.dog.plural}</option>
          <option value="cat">{SPECIES.cat.plural}</option>
          <option value="bearded_dragon">{SPECIES.bearded_dragon.plural}</option>
        </Select>
      </div>
      <div className="flex-1">
        <Select label="Age" name="age" defaultValue="">
          <option value="">Any age</option>
          {AGE_CATEGORIES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit" variant="dark" pill={false} className="justify-center">
        Search
      </Button>
    </form>
  );
}
