"use client";

import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import { uploadStoryPhoto, deleteStoryPhoto } from "@/lib/actions/story-photo";
import { getStoryPhotoUrl } from "@/lib/storage";

interface StoryPhotoManagerProps {
  storyId: string;
  photoPath: string | null;
}

export function StoryPhotoManager({ storyId, photoPath }: StoryPhotoManagerProps) {
  const router = useRouter();

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadStoryPhoto(storyId, formData);
    if (result.ok) router.refresh();
    return result;
  }

  async function handleDelete() {
    const result = await deleteStoryPhoto(storyId);
    if (result.ok) router.refresh();
    return result;
  }

  return (
    <GlassCard>
      <SingleImageUploader
        label="Photo"
        helpText="Resized to 1600px wide and converted to webp automatically."
        imageUrl={photoPath ? getStoryPhotoUrl(photoPath) : null}
        onUpload={handleUpload}
        onDelete={photoPath ? handleDelete : undefined}
      />
    </GlassCard>
  );
}
