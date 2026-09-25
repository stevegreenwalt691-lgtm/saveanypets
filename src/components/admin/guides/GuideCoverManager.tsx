"use client";

import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import { uploadGuideCover, deleteGuideCover } from "@/lib/actions/guide-cover";
import { getGuideCoverUrl } from "@/lib/storage";

interface GuideCoverManagerProps {
  guideId: string;
  slug: string;
  coverPath: string | null;
}

export function GuideCoverManager({ guideId, slug, coverPath }: GuideCoverManagerProps) {
  const router = useRouter();

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadGuideCover(guideId, slug, formData);
    if (result.ok) router.refresh();
    return result;
  }

  async function handleDelete() {
    const result = await deleteGuideCover(guideId, slug);
    if (result.ok) router.refresh();
    return result;
  }

  return (
    <GlassCard>
      <SingleImageUploader
        label="Cover image"
        helpText="Resized to 1600px wide and converted to webp automatically."
        imageUrl={coverPath ? getGuideCoverUrl(coverPath) : null}
        onUpload={handleUpload}
        onDelete={coverPath ? handleDelete : undefined}
      />
    </GlassCard>
  );
}
