import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SpeciesTag } from "@/components/ui/SpeciesTag";
import { PetStatusPill } from "@/components/admin/PetStatusPill";
import { SPECIES } from "@/lib/species";
import { PET_SPECIES } from "@/lib/validation/pet";
import { PET_STATUSES, formatFee, formatPetStatus, getPetPhotoUrl, getPrimaryPhoto } from "@/lib/pets";

export const metadata: Metadata = { title: "Pets | Save Any Pets admin" };

export default async function AdminPetsPage({ searchParams }: PageProps<"/admin/pets">) {
  const { q, species, status } = await searchParams;
  const supabase = await createClient();

  const speciesFilter = PET_SPECIES.find((value) => value === species);
  const statusFilter = PET_STATUSES.find((value) => value === status);

  let query = supabase
    .from("pets")
    .select(
      "id, slug, name, species, status, adoption_fee, featured, pet_photos(id, path, alt, is_primary, sort_order)",
    )
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("name", `%${q}%`);
  if (speciesFilter) query = query.eq("species", speciesFilter);
  if (statusFilter) query = query.eq("status", statusFilter);

  const { data: pets, error } = await query;
  if (error) throw error;

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[34px] sm:text-[40px]">Pets</h1>
        <Button href="/admin/pets/new" pill={false}>
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add a pet
        </Button>
      </div>

      <GlassCard>
        <form action="/admin/pets" method="get" className="flex flex-wrap items-end gap-4">
          <div className="min-w-[220px] flex-1">
            <Input label="Search by name" name="q" defaultValue={q ?? ""} placeholder="Rex" />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select label="Species" name="species" defaultValue={species ?? ""}>
              <option value="">All species</option>
              {PET_SPECIES.map((value) => (
                <option key={value} value={value}>
                  {SPECIES[value].label}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-full sm:w-[200px]">
            <Select label="Status" name="status" defaultValue={status ?? ""}>
              <option value="">All statuses</option>
              {PET_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {formatPetStatus(value)}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" pill={false}>
            Filter
          </Button>
        </form>
      </GlassCard>

      <GlassCard noPadding className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs font-bold uppercase tracking-[0.5px] text-ink-3">
              <th className="px-4 py-3">Pet</th>
              <th className="px-4 py-3">Species</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(pets ?? []).map((pet) => {
              const photo = getPrimaryPhoto(pet.pet_photos);
              return (
                <tr key={pet.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/pets/${pet.id}`}
                      className="flex items-center gap-3 font-bold text-ink hover:underline"
                    >
                      <span
                        className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px] ${
                          photo ? "" : SPECIES[pet.species].photo
                        }`}
                      >
                        {photo ? (
                          <Image
                            src={getPetPhotoUrl(photo.path)}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : null}
                      </span>
                      {pet.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <SpeciesTag species={pet.species} />
                  </td>
                  <td className="px-4 py-3">
                    <PetStatusPill status={pet.status} />
                  </td>
                  <td className="px-4 py-3 text-ink-2">{formatFee(pet.adoption_fee)}</td>
                  <td className="px-4 py-3 text-ink-2">{pet.featured ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/pets/${pet.id}`}
                      className="text-sm font-bold text-brand hover:text-brand-hover"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(pets ?? []).length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-2">No pets match your filters.</p>
        ) : null}
      </GlassCard>
    </div>
  );
}
