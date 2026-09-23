import Link from "next/link";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SpeciesTag } from "@/components/ui/SpeciesTag";
import { FavoriteButton } from "@/components/pets/FavoriteButton";
import { SPECIES } from "@/lib/species";
import { getAgeLabel } from "@/lib/pet-age";
import { formatSex, formatSize, getPetPhotoUrl, getPrimaryPhoto, type PetSummary } from "@/lib/pets";

interface PetCardProps {
  pet: PetSummary;
}

export function PetCard({ pet }: PetCardProps) {
  const species = SPECIES[pet.species];
  const size = formatSize(pet.size);
  const meta = [getAgeLabel(pet.birth_date), formatSex(pet.sex), size].filter(Boolean).join(" · ");
  const photo = getPrimaryPhoto(pet.pet_photos);

  return (
    <GlassCard noPadding className="relative flex flex-col gap-3 p-3">
      <Link
        href={`/adopt/${pet.slug}`}
        className={`relative block aspect-[4/3] overflow-hidden rounded-[20px] ${photo ? "bg-ink/5" : species.photo}`}
      >
        {photo ? (
          <Image
            src={getPetPhotoUrl(photo.path)}
            alt={photo.alt ?? `${pet.name}, a ${species.label.toLowerCase()}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-display text-2xl font-bold text-ink/70">
            {pet.name}
          </span>
        )}
        <SpeciesTag species={pet.species} onPhoto className="absolute left-2 top-2" />
        {pet.status === "pending" ? (
          <span className="absolute bottom-2 left-2 inline-flex items-center rounded-full bg-warning px-3 py-1 text-[13px] font-bold text-white">
            Adoption pending
          </span>
        ) : null}
      </Link>

      <FavoriteButton petId={pet.id} petName={pet.name} className="absolute right-5 top-5" />

      <div className="flex flex-1 flex-col gap-1 px-1">
        <Link href={`/adopt/${pet.slug}`}>
          <h3 className="text-2xl hover:underline">{pet.name}</h3>
        </Link>
        <p className="text-sm text-ink-3">{meta}</p>
      </div>

      <Button href={`/adopt/${pet.slug}`} variant="dark" pill={false} className="w-full">
        Meet {pet.name}
      </Button>
    </GlassCard>
  );
}
