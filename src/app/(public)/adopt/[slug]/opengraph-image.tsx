import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { SPECIES } from "@/lib/species";
import { getPetPhotoUrl, PUBLIC_PET_STATUSES } from "@/lib/pets";

export const alt = "Pet photo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SPECIES_PHOTO_COLOR: Record<keyof typeof SPECIES, string> = {
  dog: "#f2cdb4",
  cat: "#e3d4f0",
  bearded_dragon: "#cfe6d3",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: pet } = await supabase
    .from("pets")
    .select("name, species, pet_photos(path, is_primary, sort_order)")
    .eq("slug", slug)
    .in("status", PUBLIC_PET_STATUSES)
    .maybeSingle();

  const name = pet?.name ?? "Save Any Pets";
  const species = pet ? SPECIES[pet.species] : null;
  const photos = pet?.pet_photos ?? [];
  const photo = photos.length > 0 ? (photos.find((p) => p.is_primary) ?? [...photos].sort((a, b) => a.sort_order - b.sort_order)[0]) : null;
  const backgroundColor = pet ? SPECIES_PHOTO_COLOR[pet.species] : "#fbf1e6";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor,
        }}
      >
        {photo ? (
          <img
            src={getPetPhotoUrl(photo.path)}
            alt=""
            width={size.width}
            height={size.height}
            style={{ objectFit: "cover", position: "absolute", inset: 0 }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "64px",
            background: photo
              ? "linear-gradient(to top, rgba(43,33,27,0.78) 0%, rgba(43,33,27,0.05) 55%)"
              : "none",
          }}
        >
          <span
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: photo ? "#ffffff" : "#2b211b",
              opacity: 0.85,
            }}
          >
            Save Any Pets
          </span>
          <span
            style={{
              marginTop: 12,
              fontSize: 88,
              fontWeight: 700,
              color: photo ? "#ffffff" : "#2b211b",
            }}
          >
            {name}
          </span>
          {species ? (
            <span
              style={{
                marginTop: 8,
                fontSize: 36,
                fontWeight: 500,
                color: photo ? "#ffffff" : "#2b211b",
                opacity: 0.85,
              }}
            >
              {species.label}
            </span>
          ) : null}
        </div>
      </div>
    ),
    { ...size },
  );
}
